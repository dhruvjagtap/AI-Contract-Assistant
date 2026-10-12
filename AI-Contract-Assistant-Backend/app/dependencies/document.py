from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.document_repository import DocumentRepository
from app.repositories.processing_job_repository import ProcessingJobRepository
from app.services.document_service import DocumentService

def get_document_repository(
    db: Session = Depends(get_db),
) -> DocumentRepository:
    """
    Provides DocumentRepository instance.
    """

    return DocumentRepository(db)

def get_document_service(
    db: Session = Depends(get_db),
) -> DocumentService:
    return DocumentService(
        repository=DocumentRepository(db),
        processing_repository=ProcessingJobRepository(db),
    )