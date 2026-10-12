from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chunk import Chunk


class ChunkRepository:
    """
    Handles database operations for document chunks.
    """

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def create_many(
        self,
        chunks: list[Chunk],
    ) -> list[Chunk]:
        """
        Save multiple chunks at once.
        """

        print(
            "INSERTING CHUNKS:",
            len(chunks),
        )

        self.db.add_all(chunks)

        self.db.commit()

        for chunk in chunks:
            self.db.refresh(chunk)

        return chunks

    def get_document_chunks(
        self,
        document_id: int,
    ) -> list[Chunk]:
        """
        Retrieve all chunks for a document.
        """

        statement = (
            select(Chunk)
            .where(
                Chunk.document_id == document_id
            )
            .order_by(
                Chunk.chunk_index
            )
        )

        result = self.db.execute(statement)

        return list(
            result.scalars().all()
        )

    def search_similar(
        self,
        document_id: int,
        embedding: list[float],
        limit: int = 5,
    ) -> list[Chunk]:
        """
        Find the most semantically similar chunks
        for a document using pgvector cosine distance.
        """

        statement = (
            select(Chunk)
            .where(
                Chunk.document_id == document_id,
                Chunk.embedding.is_not(None),
            )
            .order_by(
                Chunk.embedding.cosine_distance(
                    embedding
                )
            )
            .limit(limit)
        )

        result = self.db.execute(statement)

        return list(
            result.scalars().all()
        )