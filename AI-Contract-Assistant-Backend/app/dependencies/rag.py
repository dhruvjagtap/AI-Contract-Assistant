from fastapi import Depends

from app.services.rag_service import RAGService
from app.services.search_service import SearchService
from app.services.llm_service import LLMService
from app.dependencies.search import get_search_service


def get_rag_service(
    search_service: SearchService = Depends(
        get_search_service
    ),
) -> RAGService:

    return RAGService(
        search_service=search_service,
        llm_service=LLMService(),
    )