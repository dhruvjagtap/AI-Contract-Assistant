# AI-Contract-Assistant-Backend/app/repositories/document_repository.py
from typing import Sequence
from unittest import result

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:
    """
    Handles all database operations related to documents.
    """

    def __init__(self, db: Session):
        self.db = db


    def create( self, document: Document,) -> Document:
        """
        Store a new document record.
        """

        self.db.add(document)

        self.db.commit()

        self.db.refresh(document)

        return document


    def get_user_documents( self, user_id: int, ) -> Sequence[Document]:
        """
        Return all documents belonging to a user.
        """

        statement = (
            select(Document)
            .where(Document.user_id == user_id)
            .order_by(Document.created_at.desc())
        )

        result = self.db.execute(statement)

        return result.scalars().all()


    def get_by_id( self, document_id: int, user_id: int, ) -> Document | None:
        """
        Fetch a document owned by a specific user.
        """

        statement = (
            select(Document)
            .where(
                Document.id == document_id,
                Document.user_id == user_id,
            )
        )

        result = self.db.execute(statement)

        return result.scalar_one_or_none()

    def get_by_id_internal(
        self,
        document_id: int,
    ) -> Document | None:
        """
        Internal fetch for background processing.
        """

        statement = (
            select(Document)
            .where(
                Document.id == document_id
            )
        )
        result = self.db.execute(statement)

        return result.scalar_one_or_none()


    def delete( self, document: Document, ) -> None:
        """
        Delete document metadata.
        """

        self.db.delete(document)

        self.db.commit()

    