from app.services.search_service import SearchService
from app.services.llm_service import LLMService


class RAGService:
    """
    Retrieves relevant document chunks and generates
    answers using the local LLM.
    """

    def __init__(
        self,
        search_service: SearchService,
        llm_service: LLMService,
    ):
        self.search_service = search_service
        self.llm_service = llm_service

    def retrieve_context(
        self,
        question: str,
        document_id: int,
        limit: int = 5,
    ) -> dict:
        """
        Retrieve relevant chunks and build LLM context.
        """

        chunks = self.search_service.search(
            query=question,
            document_id=document_id,
            limit=limit,
        )

        context_parts = []
        sources = []

        for chunk in chunks:
            context_parts.append(chunk.chunk_text)

            sources.append(
                {
                    "chunk_id": chunk.id,
                    "page_number": chunk.page_number,
                    "chunk_index": chunk.chunk_index,
                    "chunk_text": chunk.chunk_text,
                }
            )

        context = "\n\n".join(context_parts)

        return {
            "context": context,
            "sources": sources,
        }

    def answer_question(
        self,
        question: str,
        document_id: int,
        limit: int = 5,
    ) -> dict:
        """
        Retrieve relevant document context and
        generate an answer using the LLM.
        """

        retrieved = self.retrieve_context(
            question=question,
            document_id=document_id,
            limit=limit,
        )

        answer = self.llm_service.generate_answer(
            question=question,
            context=retrieved["context"],
        )

        return {
            "answer": answer,
            "sources": retrieved["sources"],
        }