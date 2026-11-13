from fastapi import UploadFile

from app.exceptions import DogNotFoundException, ReportNotFoundException
from app.models import Report, User
from app.schemas import ReportCreate, ReportUpdate
from app.utilities import delete_image, save_image


class ReportsService:
    def __init__(self, db, repository, dog_repository):
        self.db = db
        self.report_repository = repository
        self.dog_repository = dog_repository

    async def create_report(self, user: User, data: ReportCreate, image: UploadFile):

        if data.dog_code is not None:
            dog = await self.dog_repository.get_by_dog_code(data.dog_code)

            if dog is None:
                raise DogNotFoundException(
                    f"Dog with code {data.dog_code} is not found !"
                )
        file_path = None
        if image is not None:
            filename = image.filename
            file_path = await save_image(image)

        report = Report(
            reporter_id=user.id,
            dog_id=None if data.dog_code is None else dog.id,
            report_type=data.report_type,
            description=data.description,
            state = data.state , 
            district = data.district , 
            area_name = data.area_name ,
            pincode=data.pincode,
            location=data.location,
            image_filename=None if image is None else filename,
            image_path=None if image is None else file_path,
        )

        try:
            result = await self.report_repository.create(report)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            if file_path is not None:
                delete_image(file_path)
            raise

    async def get_all_reports(self, filters, limit, offset):
        result = await self.report_repository.get_all(filters, limit, offset)

        return result

    async def get_report_by_id(self, report_id: int) -> Report:
        result = await self.report_repository.get_by_id(report_id)

        if result is None:
            raise ReportNotFoundException(f"Report with id {report_id} is not Found !")
        return result

    async def get_current_user_reports(self, user: User) -> list[Report]:
        result = await self.report_repository.get_by_reporter_id(user.id)
        return result

    async def update_status_by_report_id(self, report_id, report_data):
        report = await self.report_repository.get_by_id(report_id)

        if report is None:
            raise ReportNotFoundException(f"Report with id {report_id} not found ")
        
        result = await self.report_repository.update_status_by_id(
            report, report_data.status
        )
        await self.db.commit()
        return result

    async def update_report(self, user: User, report_id: int, data: ReportUpdate) -> Report:
        report = await self.get_report_by_id(report_id)
        if report.reporter_id != user.id:
            from app.exceptions import ForbiddenException
            raise ForbiddenException("You can only edit your own reports")

        fields = data.model_dump(exclude_unset=True)
        if "dog_code" in fields:
            dog_code = fields.pop("dog_code")
            if dog_code is None:
                report.dog_id = None
            else:
                dog = await self.dog_repository.get_by_dog_code(dog_code)
                if dog is None:
                    raise DogNotFoundException(f"Dog with code {dog_code} is not found !")
                report.dog_id = dog.id

        try:
            result = await self.report_repository.update(report, fields)
            await self.db.commit()
            return result
        except Exception:
            await self.db.rollback()
            raise

    async def delete_report(self, user: User, report_id: int) -> None:
        report = await self.get_report_by_id(report_id)
        if report.reporter_id != user.id:
            from app.exceptions import ForbiddenException
            raise ForbiddenException("You can only delete your own reports")

        try:
            await self.report_repository.delete(report)
            await self.db.commit()
        except Exception:
            await self.db.rollback()
            raise
