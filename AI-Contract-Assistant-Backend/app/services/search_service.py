from app.repositories.chunk_repository import ChunkRepository
from app.services.embedding_service import EmbeddingService


class SearchService:
    """
    Handles semantic search over document chunks.
    """

    def __init__(
        self,
        embedding_service: EmbeddingService,
        chunk_repository: ChunkRepository,
    ):
        self.embedding_service = embedding_service
        self.chunk_repository = chunk_repository

    def search(
        self,
        query: str,
        document_id: int,
        limit: int = 5,
    ) -> list:

        query_embedding = (
            self.embedding_service.create_embedding(
                query
            )
        )

        results = (
            self.chunk_repository.search_similar(
                document_id=document_id,
                embedding=query_embedding,
                limit=limit,
            )
        )

        return results