# app/models/processing_job.py
from datetime import datetime
from enum import Enum

from sqlalchemy import (
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class ProcessingStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"



class ProcessingJob(Base):

    __tablename__ = "processing_jobs"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )


    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id"),
        nullable=False,
        index=True,
    )


    status: Mapped[ProcessingStatus] = mapped_column(
        SQLEnum(ProcessingStatus),
        default=ProcessingStatus.PENDING,
        nullable=False,
    )


    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )


    started_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )


    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )


    document = relationship(
        "Document",
        back_populates="processing_jobs",
    )