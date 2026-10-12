# app/dependencies/processing.py
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.repositories.processing_job_repository import (
    ProcessingJobRepository,
)

from app.repositories.chunk_repository import (
    ChunkRepository,
)

from app.services.pdf_service import PDFService
from app.services.chunk_service import ChunkService
from app.services.processing_service import ProcessingService
from app.services.embedding_service import EmbeddingService

def get_processing_job_repository(
    db: Session = Depends(get_db),
):
    return ProcessingJobRepository(db)



def get_chunk_repository(
    db: Session = Depends(get_db),
):
    return ChunkRepository(db)



def get_processing_service() -> ProcessingService:
    """
    Provide ProcessingService for background document processing.
    """

    return ProcessingService(
        pdf_service=PDFService(),
        chunk_service=ChunkService(),
        embedding_service=EmbeddingService(),
    )