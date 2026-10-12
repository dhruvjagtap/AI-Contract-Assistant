from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.processing_job import (
    ProcessingJob,
    ProcessingStatus,
)


class ProcessingJobRepository:
    """
    Handles database operations for processing jobs.
    """


    def __init__(
        self,
        db: Session,
    ):
        self.db = db


    def create(
        self,
        job: ProcessingJob,
    ) -> ProcessingJob:
        """
        Create a new processing job.
        """

        self.db.add(job)

        self.db.commit()

        self.db.refresh(job)

        return job


    def get_by_id(
        self,
        job_id: int,
    ) -> ProcessingJob | None:
        """
        Retrieve processing job by id.
        """

        statement = (
            select(ProcessingJob)
            .where(
                ProcessingJob.id == job_id
            )
        )

        result = self.db.execute(statement)

        return result.scalar_one_or_none()


    def get_document_job(
        self,
        document_id: int,
    ) -> ProcessingJob | None:
        """
        Get latest processing job for a document.
        """

        statement = (
            select(ProcessingJob)
            .where(
                ProcessingJob.document_id == document_id
            )
            .order_by(
                ProcessingJob.created_at.desc()
            )
        )


        result = self.db.execute(statement)

        return result.scalars().first()


    def update_status(
        self,
        job: ProcessingJob,
        status: ProcessingStatus,
    ) -> ProcessingJob:
        """
        Update processing status.
        """

        job.status = status


        if status == ProcessingStatus.PROCESSING:
            job.started_at = datetime.utcnow()


        if status == ProcessingStatus.COMPLETED:
            job.completed_at = datetime.utcnow()


        self.db.commit()

        self.db.refresh(job)

        return job


    def mark_failed(
        self,
        job: ProcessingJob,
        error_message: str,
    ) -> ProcessingJob:
        """
        Mark processing job as failed.
        """

        job.status = ProcessingStatus.FAILED

        job.error_message = error_message

        job.completed_at = datetime.utcnow()


        self.db.commit()

        self.db.refresh(job)

        return job