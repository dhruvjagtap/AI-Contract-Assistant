# app/models/chunk.py
import uuid

from datetime import datetime

from sqlalchemy import (
    Text,
    Integer,
    ForeignKey,
    DateTime,
    func,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from pgvector.sqlalchemy import Vector

from app.database.base import Base


class Chunk(Base):

    __tablename__ = "chunks"


    id: Mapped[str] = mapped_column(
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )


    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id"),
        nullable=False,
        index=True,
    )


    page_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )


    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )


    chunk_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )


    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(384),
        nullable=True,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )


    document = relationship(
        "Document",
        back_populates="chunks",
    )