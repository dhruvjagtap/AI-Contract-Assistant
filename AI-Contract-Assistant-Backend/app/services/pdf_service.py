# app/services/pdf_service.py
from pathlib import Path

import fitz


class PDFService:
    """
    Handles PDF text extraction.
    """

    def extract_text(
        self,
        file_path: Path,
    ) -> list[dict]:

        document = fitz.open(file_path)

        pages = []

        for page_number, page in enumerate(
            document,
            start=1,
        ):

            text = page.get_text()

            print(
                "PAGE",
                page_number,
                "TEXT LENGTH:",
                len(text)
            )

            pages.append(
                {
                    "page_number": page_number,
                    "text": text,
                }
            )

        document.close()

        print(
            "RETURNING PAGES:",
            len(pages)
        )

        return pages