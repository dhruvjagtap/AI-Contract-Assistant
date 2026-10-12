# app/services/processing_service.py

from pathlib import Path

from app.database.session import SessionLocal
from app.models.document import DocumentStatus
from app.models.chunk import Chunk
from app.models.processing_job import ProcessingStatus

from app.repositories.document_repository import DocumentRepository
from app.repositories.processing_job_repository import (
    ProcessingJobRepository,
)
from app.repositories.chunk_repository import (
    ChunkRepository,
)

from app.services.pdf_service import PDFService
from app.services.chunk_service import ChunkService
from app.services.embedding_service import EmbeddingService


class ProcessingService:
    """
    Handles document processing pipeline.

    This service owns its database session because
    it runs inside a background task.
    """

    def __init__(
        self,
        pdf_service: PDFService,
        chunk_service: ChunkService,
        embedding_service: EmbeddingService,
    ):
        self.pdf_service = pdf_service
        self.chunk_service = chunk_service
        self.embedding_service = embedding_service

    def process_document(
        self,
        document_id: int,
    ) -> None:
        """
        Process uploaded document.

        Workflow:

        Document
            ↓
        Extract PDF text
            ↓
        Create chunks
            ↓
        Generate embeddings
            ↓
        Save chunks
            ↓
        Mark processing job completed
            ↓
        Mark document ready
        """

        db = SessionLocal()

        document = None
        processing_repository = None

        try:
            document_repository = DocumentRepository(db)
            processing_repository = ProcessingJobRepository(db)
            chunk_repository = ChunkRepository(db)

            document = (
                document_repository
                .get_by_id_internal(document_id)
            )

            if document is None:
                raise Exception("Document not found")

            job = (
                processing_repository
                .get_document_job(document_id)
            )

            if job is None:
                raise Exception("Processing job not found")

            # -----------------------------------------
            # 1. Mark processing job as PROCESSING
            # -----------------------------------------

            processing_repository.update_status(
                job,
                ProcessingStatus.PROCESSING,
            )

            # -----------------------------------------
            # 2. Extract PDF text
            # -----------------------------------------

            pages = self.pdf_service.extract_text(
                Path(document.file_path)
            )

            print(
                "PROCESSING SERVICE PAGES:",
                len(pages),
            )

            for page in pages:
                print(
                    "PROCESS PAGE:",
                    page["page_number"],
                )

            # -----------------------------------------
            # 3. Create chunks
            # -----------------------------------------

            chunks_data = (
                self.chunk_service.create_chunks(
                    pages
                )
            )

            chunks = []

            # -----------------------------------------
            # 4. Generate embeddings
            # -----------------------------------------

            for item in chunks_data:
                embedding = (
                    self.embedding_service.create_embedding(
                        item["text"]
                    )
                )

                chunks.append(
                    Chunk(
                        document_id=document.id,
                        page_number=item["page_number"],
                        chunk_index=item["chunk_index"],
                        chunk_text=item["text"],
                        embedding=embedding,
                    )
                )

            print(
                "INSERTING CHUNKS:",
                len(chunks),
            )

            # -----------------------------------------
            # 5. Save chunks
            # -----------------------------------------

            chunk_repository.create_many(chunks)

            # -----------------------------------------
            # 6. Mark processing job as COMPLETED
            # -----------------------------------------

            processing_repository.update_status(
                job,
                ProcessingStatus.COMPLETED,
            )

            # -----------------------------------------
            # 7. Mark document as READY
            # -----------------------------------------

            document.status = DocumentStatus.READY

            db.commit()

            print(
                f"DOCUMENT {document.id} STATUS: READY"
            )

        except Exception as e:

            print(
                f"DOCUMENT {document_id} PROCESSING FAILED:",
                str(e),
            )

            try:
                # Mark document as failed
                if document is not None:
                    document.status = DocumentStatus.FAILED
                    db.commit()

                # Mark processing job as failed
                if processing_repository is not None:
                    job = (
                        processing_repository
                        .get_document_job(document_id)
                    )

                    if job:
                        processing_repository.mark_failed(
                            job,
                            str(e),
                        )

            except Exception:
                pass

            raise

        finally:
            db.close()