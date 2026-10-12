# AI-Contract-Assistant-Backend/app/services/document_service.py
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.models.document import Document
from app.repositories.document_repository import DocumentRepository
from app.repositories.processing_job_repository import (
    ProcessingJobRepository,
)
from app.models.processing_job import ProcessingJob


class DocumentService:
    """
    Business logic for document operations.
    """

    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
    UPLOAD_DIRECTORY = Path("uploads")

    def __init__(
        self,
        repository: DocumentRepository,
        processing_repository: ProcessingJobRepository,
    ):
        self.repository = repository
        self.processing_repository = processing_repository

    async def upload_document(
        self,
        *,
        user_id: int,
        file: UploadFile,
    ) -> Document:
        """
        Handles complete document upload workflow.

        Steps:
        1. Validate file
        2. Save physical file
        3. Create database record
        4. Create processing job
        """

        self._validate_file(file)

        file_path, file_size = await self._save_file(
            user_id=user_id,
            file=file,
        )

        document = Document(
            user_id=user_id,
            filename=file.filename or "unknown.pdf",
            file_path=str(file_path),
            file_size=file_size,
        )

        document = self.repository.create(document)

        job = ProcessingJob(
            document_id=document.id,
        )

        self.processing_repository.create(job)

        return document

    def _validate_file(
        self,
        file: UploadFile,
    ) -> None:
        """
        Validate uploaded file type.
        """

        if file.content_type != "application/pdf":
            raise ValueError(
                "Only PDF files are allowed"
            )

    async def _save_file(
        self,
        *,
        user_id: int,
        file: UploadFile,
    ) -> tuple[Path, int]:
        """
        Save uploaded file to local storage.
        """

        user_directory = (
            self.UPLOAD_DIRECTORY
            / f"user_{user_id}"
        )

        user_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        safe_filename = (
            f"{uuid4()}-{file.filename}"
        )

        destination = (
            user_directory / safe_filename
        )

        content = await file.read()
        file_size = len(content)

        if file_size > self.MAX_FILE_SIZE:
            raise ValueError(
                "File exceeds maximum size"
            )

        destination.write_bytes(content)

        return destination, file_size

    def get_user_documents(
        self,
        *,
        user_id: int,
    ) -> list[Document]:
        return list(
            self.repository.get_user_documents(
                user_id=user_id
            )
        )

    def get_document(
        self,
        *,
        document_id: int,
        user_id: int,
    ) -> Document:
        document = self.repository.get_by_id(
            document_id=document_id,
            user_id=user_id,
        )

        if document is None:
            raise ValueError(
                "Document not found"
            )

        return document

    def delete_document(
        self,
        *,
        document_id: int,
        user_id: int,
    ) -> None:
        document = self.get_document(
            document_id=document_id,
            user_id=user_id,
        )

        self.repository.delete(document)

    def get_document_file(
        self,
        *,
        document_id: int,
        user_id: int,
    ) -> Path:
        document = self.get_document(
            document_id=document_id,
            user_id=user_id,
        )

        file_path = Path(document.file_path)

        if not file_path.exists():
            raise ValueError(
                "File not found"
            )

        return file_path

    def get_processing_job(
        self,
        document_id: int,
    ):
        return (
            self.processing_repository
            .get_document_job(document_id)
        )