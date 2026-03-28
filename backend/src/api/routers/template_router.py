from typing import Any, Dict, List, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from langchain_openai import OpenAIEmbeddings
from pydantic import BaseModel

from src.domain.ports.vector_store import VectorStorePort

router = APIRouter(prefix="/templates", tags=["templates"])


class TemplateCreate(BaseModel):
    name: str
    content: str
    schema_data: Dict[str, Any]


class TemplateResponse(BaseModel):
    id: str
    name: str
    content: str
    schema_data: Dict[str, Any]


# We will inject these via a dependency or global config
_db_adapter: Optional[VectorStorePort] = None
_embeddings: Optional[OpenAIEmbeddings] = None


def init_router(db: VectorStorePort, emb: OpenAIEmbeddings):
    global _db_adapter, _embeddings
    _db_adapter = db
    _embeddings = emb


@router.post("/", response_model=TemplateResponse)
async def create_template(template: TemplateCreate):
    if not _db_adapter or not _embeddings:
        raise HTTPException(status_code=500, detail="Router not initialized")

    # Generate embedding for semantic search (based on name for now, or name + content summary)
    embedding = await _embeddings.aembed_query(template.name)

    new_template = {
        "id": str(uuid4()),
        "name": template.name,
        "content": template.content,
        "schema_data": template.schema_data,
        "embedding": embedding,
    }

    await _db_adapter.save_template(new_template)
    return new_template


@router.get("/", response_model=List[TemplateResponse])
async def list_templates(limit: int = 20):
    if not _db_adapter:
        raise HTTPException(status_code=500, detail="Router not initialized")
    results = await _db_adapter.list_templates(limit=limit)
    return results


@router.get("/{name}", response_model=TemplateResponse)
async def get_template(name: str):
    template = await _db_adapter.get_template_by_name(name)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@router.get("/search/", response_model=List[TemplateResponse])
async def search_templates(query: str, limit: int = 5):
    if not _embeddings:
        raise HTTPException(status_code=500, detail="Router not initialized")

    query_vec = await _embeddings.aembed_query(query)
    results = await _db_adapter.search_templates(query_vec, limit=limit)
    return results


@router.delete("/{name}")
async def delete_template(name: str):
    await _db_adapter.delete_template(name)
    return {"status": "deleted"}
