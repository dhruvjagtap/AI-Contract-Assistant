from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.chunk_repository import ChunkRepository
from app.services.embedding_service import EmbeddingService
from app.services.search_service import SearchService


def get_search_service(
    db: Session = Depends(get_db),
) -> SearchService:

    return SearchService(
        embedding_service=EmbeddingService(),
        chunk_repository=ChunkRepository(db),
    )