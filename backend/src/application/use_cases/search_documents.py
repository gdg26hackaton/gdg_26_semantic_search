import os
from typing import List

from langchain_openai import OpenAIEmbeddings

from src.domain.entities.document import DocumentChunk
from src.domain.ports.vector_store import VectorStorePort


class SearchDocumentsUseCase:
    def __init__(self, vector_store: VectorStorePort):
        self.vector_store = vector_store
        self.embeddings = OpenAIEmbeddings()  # Default to OpenAI for now

    async def execute(self, query: str, limit: int = 5) -> List[DocumentChunk]:
        query_vector = await self.embeddings.aembed_query(query)
        return await self.vector_store.search_chunks(query_vector, limit)
