from typing import Protocol

from app.schemas import (
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    VerifyResetOTPRequest,
    VerifyResetOTPResponse,
)


class PasswordResetServiceProtocol(Protocol):
    async def request_password_reset(
        self,
        data: ForgotPasswordRequest,
    ) -> MessageResponse: ...

    async def verify_reset_otp(
        self,
        data: VerifyResetOTPRequest,
    ) -> VerifyResetOTPResponse: ...

    async def reset_password(
        self,
        data: ResetPasswordRequest,
    ) -> MessageResponse: ...
