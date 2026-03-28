from abc import ABC, abstractmethod
from typing import Dict, Any
from src.domain.entities.document import Document
from src.domain.entities.template import Template

class PdfGeneratorPort(ABC):
    @abstractmethod
    async def generate_from_layout(self, layout_data: Dict[str, Any]) -> bytes:
        """Reconstructs a PDF from OCR layout data."""
        return b""

    @abstractmethod
    async def generate_from_template(self, template: Template, data: Dict[str, Any]) -> bytes:
        """Generates a PDF from a predefined template and dynamic data."""
        return b""

    @abstractmethod
    async def verify_design(self, original_pdf: bytes, generated_pdf: bytes) -> float:
        """Returns a similarity score (0-1) between the original and generated PDF."""
        return 0.0
