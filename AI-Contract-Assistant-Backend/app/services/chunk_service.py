# app/services/chunk_service.py
class ChunkService:
    """
    Converts extracted text into chunks.
    """


    CHUNK_SIZE = 1000


    def create_chunks(
        self,
        pages: list[dict],
    ) -> list[dict]:
        """
        Split pages into text chunks.
        """

        chunks = []

        chunk_index = 0


        for page in pages:

            text = page["text"]

            page_number = page["page_number"]


            for start in range(
                0,
                len(text),
                self.CHUNK_SIZE,
            ):

                chunk_text = text[
                    start:start + self.CHUNK_SIZE
                ]


                chunks.append(
                    {
                        "page_number": page_number,
                        "chunk_index": chunk_index,
                        "text": chunk_text,
                    }
                )


                chunk_index += 1

        print(
    "TOTAL PAGES:",
    len(pages)
)


        return chunks