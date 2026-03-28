from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from src.domain.entities.document import Document, DocumentChunk

class VectorStorePort(ABC):
    @abstractmethod
    async def save_document(self, document: Document) -> None:
        pass

    @abstractmethod
    async def search_chunks(self, query_vector: List[float], limit: int = 5) -> List[DocumentChunk]:
        return []

    @abstractmethod
    async def get_document(self, document_id: UUID) -> Optional[Document]:
        return None
