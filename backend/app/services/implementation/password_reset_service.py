import hashlib
import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.core import hash_otp, hash_password, verify_otp
from app.models.password_reset import PasswordReset
from app.repositories.protocols import (
    PasswordResetRepositoryProtocol,
    UserRepositoryProtocol,
)
from app.schemas.password_reset import (
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    VerifyResetOTPRequest,
    VerifyResetOTPResponse,
)
from app.utilities import generate_otp


class PasswordResetService:
    OTP_EXPIRE_MINUTES = 5
    RESET_TOKEN_EXPIRE_MINUTES = 10
    MAX_OTP_ATTEMPTS = 5

    def __init__(
        self,
        db: AsyncSession,
        password_reset_repository: PasswordResetRepositoryProtocol,
        user_repository: UserRepositoryProtocol,
    ):
        self.db = db
        self.password_reset_repository = password_reset_repository
        self.user_repository = user_repository

    # --------------------------------------------------
    # 1. REQUEST PASSWORD RESET
    # --------------------------------------------------

    async def request_password_reset(
        self,
        data: ForgotPasswordRequest,
    ) -> MessageResponse:

        try:
            user = await self.user_repository.get_by_email(data.email)

            # Generic response prevents account enumeration.
            if not user:
                return MessageResponse(
                    message="If an account exists with this email, "
                    "you will receive an OTP shortly."
                )

            # Invalidate any previous active reset request.
            await self.password_reset_repository.invalidate_previous(user.id)

            otp = str(generate_otp())
            hashed_otp = hash_otp(otp)

            password_reset = PasswordReset(
                user_id=user.id,
                otp_hash=hashed_otp,
                attempts=0,
                expires_at=datetime.now(UTC)
                + timedelta(minutes=self.OTP_EXPIRE_MINUTES),
            )

            await self.password_reset_repository.create(password_reset)

            await self.db.commit()

            # TODO: Enqueue email delivery using Celery later.
            # Never return the OTP in the API response.

            return MessageResponse(
                message="If an account exists with this email, "
                "you will receive an OTP shortly."
            )

        except Exception:
            await self.db.rollback()
            raise

    async def verify_reset_otp(
        self,
        data: VerifyResetOTPRequest,
    ) -> VerifyResetOTPResponse:

        try:
            user = await self.user_repository.get_by_email(data.email)

            if not user:
                raise ValueError("Invalid or expired OTP.")

            reset_record = await self.password_reset_repository.get_latest_by_user(
                user.id
            )

            if not reset_record:
                raise ValueError("Invalid or expired OTP.")

            now = datetime.now(UTC)

            # Check whether the OTP has already been used.
            if reset_record.consumed_at is not None:
                raise ValueError("This OTP has already been used.")

            # Check whether the OTP was already verified.
            if reset_record.verified_at is not None:
                raise ValueError("This OTP has already been verified.")

            # Check OTP expiry.
            if reset_record.expires_at <= now:
                raise ValueError("OTP has expired.")

            # Check maximum attempts.
            if reset_record.attempts >= self.MAX_OTP_ATTEMPTS:
                raise ValueError("Maximum OTP attempts exceeded.")

            # Verify OTP hash.
            if not verify_otp(data.otp, reset_record.otp_hash):
                await self.password_reset_repository.increment_attempts(reset_record.id)

                await self.db.commit()

                raise ValueError("Invalid OTP.")

            # OTP is valid. Generate a secure reset token.
            reset_token = secrets.token_urlsafe(32)

            # Store only the hash, never the plaintext token.
            reset_token_hash = hashlib.sha256(reset_token.encode("utf-8")).hexdigest()

            reset_record.verified_at = now
            reset_record.reset_token_hash = reset_token_hash
            reset_record.reset_token_expires_at = now + timedelta(
                minutes=self.RESET_TOKEN_EXPIRE_MINUTES
            )

            await self.db.commit()

            return VerifyResetOTPResponse(
                message="OTP verified successfully.",
                reset_token=reset_token,
            )

        except ValueError:
            raise

        except Exception:
            await self.db.rollback()
            raise

    # --------------------------------------------------
    # 3. RESET PASSWORD
    # --------------------------------------------------

    async def reset_password(
        self,
        data: ResetPasswordRequest,
    ) -> MessageResponse:

        try:
            # Hash the token received from the frontend.
            reset_token_hash = hashlib.sha256(
                data.reset_token.encode("utf-8")
            ).hexdigest()

            # Find the reset record using the token hash.
            reset_record = await self.password_reset_repository.get_by_reset_token_hash(
                reset_token_hash
            )

            if not reset_record:
                raise ValueError("Invalid or expired reset token.")

            now = datetime.now(UTC)

            if reset_record.verified_at is None:
                raise ValueError("OTP verification is required.")

            if reset_record.consumed_at is not None:
                raise ValueError("Reset token has already been used.")

            if (
                reset_record.reset_token_expires_at is None
                or reset_record.reset_token_expires_at <= now
            ):
                raise ValueError("Reset token has expired.")

            # Find the user associated with this reset record.
            user = await self.user_repository.get_by_id(reset_record.user_id)

            if not user:
                raise ValueError("User account no longer exists.")

            # Hash and update the new password.
            hashed_password = hash_password(data.new_password)

            await self.user_repository.update_password(
                user.id,
                hashed_password,
            )

            # Make the reset request unusable.
            await self.password_reset_repository.mark_consumed(reset_record.id)

            # TODO: Revoke all existing refresh tokens for this user.

            await self.db.commit()

            return MessageResponse(message="Password reset successfully.")

        except Exception:
            await self.db.rollback()
            raise
