import requests


class LLMService:
    """
    Generates answers using a locally running Ollama model.
    """

    OLLAMA_URL = "http://localhost:11434/api/generate"
    MODEL_NAME = "llama3"

    def generate_answer(
        self,
        question: str,
        context: str,
    ) -> str:
        """
        Generate an answer using only the retrieved context.
        """

        prompt = f"""
You are an AI assistant for a document question-answering system.

Answer the user's question using ONLY the provided document context.

If the answer cannot be found in the context, say:
"I could not find the answer in the document."

Do not make up information.
Do not use outside knowledge.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{question}

ANSWER:
"""

        response = requests.post(
            self.OLLAMA_URL,
            json={
                "model": self.MODEL_NAME,
                "prompt": prompt,
                "stream": False,
            },
            timeout=120,
        )

        response.raise_for_status()

        data = response.json()

        return data["response"].strip()