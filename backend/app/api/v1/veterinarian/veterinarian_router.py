from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query, Request, UploadFile, status
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

from app.core import UserRole, VeterinarianApprovalStatus
from app.dependencies import get_current_user, get_veterinarian_service, require_roles
from app.models import User
from app.schemas import (
    VeterinarianApprovalUpdate,
    VeterinarianCreate,
    VeterinarianFilterParams,
    VeterinarianResponse,
    VeterinarianUpdate,
)
from app.services.protocol import VeterinarianServiceProtocol

router = APIRouter(prefix="/veterinarians", tags=["Veterinarians"])


async def _parse_payload(
    request: Request,
    model: type[VeterinarianCreate] | type[VeterinarianUpdate],
) -> tuple[Any, UploadFile | None]:
    content_type = request.headers.get("content-type", "")
    if content_type.startswith("multipart/form-data"):
        form = await request.form()
        payload = {key: value for key, value in form.items() if key != "license_document"}
        document_value = form.get("license_document")
        document = (
            document_value
            if hasattr(document_value, "filename") and hasattr(document_value, "read")
            else None
        )
    else:
        payload = await request.json()
        document = None
    try:
        return model.model_validate(payload), document
    except ValidationError as exc:
        raise RequestValidationError(exc.errors(), body=payload) from exc


@router.post("/", response_model=VeterinarianResponse, status_code=status.HTTP_201_CREATED)
async def apply_as_veterinarian(
    request: Request,
    user: Annotated[User, Depends(require_roles(UserRole.USER))],
    service: Annotated[
        VeterinarianServiceProtocol, Depends(get_veterinarian_service)
    ],
):
    data, document = await _parse_payload(request, VeterinarianCreate)
    return await service.apply(user, data, document)


@router.get("/me", response_model=VeterinarianResponse)
async def get_my_veterinarian_application(
    user: Annotated[
        User, Depends(require_roles(UserRole.USER, UserRole.VETERINARIAN))
    ],
    service: Annotated[
        VeterinarianServiceProtocol, Depends(get_veterinarian_service)
    ],
):
    return await service.get_mine(user)


@router.patch("/me", response_model=VeterinarianResponse)
async def update_my_veterinarian_application(
    request: Request,
    user: Annotated[
        User, Depends(require_roles(UserRole.USER, UserRole.VETERINARIAN))
    ],
    service: Annotated[
        VeterinarianServiceProtocol, Depends(get_veterinarian_service)
    ],
):
    data, document = await _parse_payload(request, VeterinarianUpdate)
    return await service.update_mine(user, data, document)


@router.get("/pending", response_model=list[VeterinarianResponse])
async def get_pending_veterinarian_applications(
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        VeterinarianServiceProtocol, Depends(get_veterinarian_service)
    ],
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    return await service.get_pending(page, limit)


@router.get("/", response_model=list[VeterinarianResponse])
async def get_veterinarian_applications(
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        VeterinarianServiceProtocol, Depends(get_veterinarian_service)
    ],
    filters: Annotated[VeterinarianFilterParams, Depends()],
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    return await service.get_all(
        filters.approval_status, filters.clinic_id, page, limit
    )


@router.get("/{vet_id}", response_model=VeterinarianResponse)
async def get_veterinarian_application(
    vet_id: int,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        VeterinarianServiceProtocol, Depends(get_veterinarian_service)
    ],
):
    return await service.get_by_id(vet_id)


@router.patch("/{vet_id}/approval", response_model=VeterinarianResponse)
async def review_veterinarian_application(
    vet_id: int,
    data: VeterinarianApprovalUpdate,
    user: Annotated[User, Depends(require_roles(UserRole.ADMIN))],
    service: Annotated[
        VeterinarianServiceProtocol, Depends(get_veterinarian_service)
    ],
):
    return await service.update_approval(vet_id, user, data)
