# AI-Contract-Assistant-Backend/app/schemas/document.py
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.document import DocumentStatus


class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_size: int
    status: DocumentStatus
    created_at: datetime
    updated_at: datetime

    pages_count: int
    chunks_count: int

    model_config = ConfigDict(
        from_attributes=True
    )


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]