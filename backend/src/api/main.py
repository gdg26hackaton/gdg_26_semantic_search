from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.infrastructure.adapters.db.pgvector_adapter import PgVectorAdapter
from src.infrastructure.adapters.ocr.tesseract_adapter import TesseractOcrAdapter
from src.infrastructure.adapters.pdf.playwright_adapter import PlaywrightPdfAdapter
from src.infrastructure.config import Config
import uvicorn

from src.api.routers.chat_router import router as chat_router, init_router as init_chat_router
from src.api.routers.template_router import router as template_router, init_router as init_template_router
from src.api.routers.document_router import router as document_router, init_router as init_document_router
from langchain_openai import OpenAIEmbeddings
from src.infrastructure.adapters.agent.agent_service_adapter import AgentServiceAdapter

app = FastAPI(title="Semantic Search Agent API")
app.include_router(chat_router)
app.include_router(template_router)
app.include_router(document_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Adapters
db_adapter = PgVectorAdapter(Config.DATABASE_URL)
ocr_adapter = TesseractOcrAdapter()
pdf_adapter = PlaywrightPdfAdapter()
embeddings = OpenAIEmbeddings()

# Initialize Routers
agent_service = AgentServiceAdapter(ocr_adapter, db_adapter, pdf_adapter)

init_template_router(db_adapter, embeddings)
init_document_router(db_adapter, agent_service)
init_chat_router(agent_service)

@app.on_event("startup")
async def startup():
    await db_adapter.initialize_db()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
