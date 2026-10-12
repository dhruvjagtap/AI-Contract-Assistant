from sentence_transformers import SentenceTransformer


class EmbeddingService:
    """
    Creates local text embeddings using
    sentence-transformers.
    """

    MODEL_NAME = "all-MiniLM-L6-v2"

    def __init__(self):
        self.model = SentenceTransformer(
            self.MODEL_NAME
        )

    def create_embedding(
        self,
        text: str,
    ) -> list[float]:
        """
        Convert text into a 384-dimensional vector.
        """

        embedding = self.model.encode(
            text,
            convert_to_numpy=True,
        )

        return embedding.tolist()