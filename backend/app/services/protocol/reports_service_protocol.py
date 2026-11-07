from typing import Protocol

from fastapi import UploadFile

from app.models import Report, User
from app.schemas import ReportCreate


class ReportsServiceProtocol(Protocol):
    async def create_report(
        self, user: User, data: ReportCreate, image: UploadFile
    ): ...

    async def get_all_reports(self , filters, limit: int, offset: int): ...

    async def get_report_by_id(self, report_id: int) -> Report: ...

    async def get_current_user_reports(self, user: User) -> list[Report]: ...

    async def get_assigned_reports(self , user:User ) -> list[Report] : ... 
