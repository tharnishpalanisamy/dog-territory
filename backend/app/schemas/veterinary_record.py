from pydantic import BaseModel


class VeterinaryRecordCreate(BaseModel):
    dog_id: int
    medical_assignment_id: int | None = None
    diagnosis: str
    treatment: str | None = None
    medication: str | None = None
    notes: str | None = None


class VeterinaryRecordUpdate(BaseModel):
    diagnosis: str | None = None
    treatment: str | None = None
    medication: str | None = None
    notes: str | None = None