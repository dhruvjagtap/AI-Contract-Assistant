# AI-Contract-Assistant-Backend/app/api/qa.py
from fastapi import APIRouter, Depends

from app.dependencies.rag import get_rag_service
from app.services.rag_service import RAGService


router = APIRouter(
    prefix="/documents",
    tags=["Question Answering"],
)


@router.post("/{document_id}/ask")
def ask_question(
    document_id: int,
    question: str,
    rag_service: RAGService = Depends(
        get_rag_service
    ),
):
    result = rag_service.answer_question(
        question=question,
        document_id=document_id,
        limit=3,
    )

    return result