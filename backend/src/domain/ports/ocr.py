from abc import ABC, abstractmethod
from typing import BinaryIO
from src.domain.entities.document import Document

class OcrPort(ABC):
    @abstractmethod
    async def extract_text_with_layout(self, file: BinaryIO) -> Document:
        return Document()
