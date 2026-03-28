from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from src.domain.ports.agent_service import IAgentService, MessageInputDTO
from src.domain.ports.vector_store import VectorStorePort

router = APIRouter(prefix="/documents", tags=["documents"])


class DocumentResponse(BaseModel):
    id: UUID
    title: str
    file_path: Optional[str]


_db_adapter: Optional[VectorStorePort] = None
_agent_service: Optional[IAgentService] = None


def init_router(db: VectorStorePort, agent: IAgentService):
    global _db_adapter, _agent_service
    _db_adapter = db
    _agent_service = agent


@router.post("/")
async def ingest_document(file: UploadFile = File(...), title: str = Form(...)):
    if not _agent_service:
        raise HTTPException(status_code=500, detail="Agent service not initialized")

    file_bytes = await file.read()

    # Use empty DTO for ingestion triggers, or potentially a specific trigger prompt
    dto = MessageInputDTO(message=f"Process new document: {title}")

    result = await _agent_service.invoke_agent(
        thread_id=str(
            UUID(int=0)
        ),  # You could generate a UUID here or use user session
        user_messages=[dto],
        input_file=file_bytes,
        is_voice=False,
    )

    return {
        "message": result.message,
        "conversation_id": result.conversation_id,
        "has_reconstructed_pdf": result.reconstructed_pdf is not None,
    }


@router.get("/", response_model=List[DocumentResponse])
async def list_documents(limit: int = 20):
    if not _db_adapter:
        raise HTTPException(status_code=500, detail="Database not initialized")

    docs = await _db_adapter.list_documents(limit=limit)
    return [{"id": d.id, "title": d.title, "file_path": d.file_path} for d in docs]


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: UUID):
    doc = await _db_adapter.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"id": doc.id, "title": doc.title, "file_path": doc.file_path}


@router.delete("/{document_id}")
async def delete_document(document_id: UUID):
    await _db_adapter.delete_document(document_id)
    return {"status": "deleted"}
