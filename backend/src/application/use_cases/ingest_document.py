from typing import BinaryIO, List
from src.domain.entities.document import Document
from src.domain.ports.ocr import OcrPort
from src.domain.ports.vector_store import VectorStorePort
from src.domain.ports.pdf_generator import PdfGeneratorPort

class IngestDocumentUseCase:
    def __init__(self, ocr_adapter: OcrPort, vector_store: VectorStorePort, pdf_generator: PdfGeneratorPort):
        self.ocr_adapter = ocr_adapter
        self.vector_store = vector_store
        self.pdf_generator = pdf_generator

    async def execute(self, file: BinaryIO, title: str) -> Document:
        # 1. OCR + Layout Extraction
        document = await self.ocr_adapter.extract_text_with_layout(file)
        document.title = title
        
        # 2. Reconstruct & Verify (Simplified for initial flow)
        # In a real LangGraph flow, this would be more complex
        
        # 3. Save to Vector Store
        await self.vector_store.save_document(document)
        
        return document
