from typing import Annotated, Any, Dict, List, Optional, TypedDict

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langgraph.graph import END, StateGraph

from src.domain.entities.document import Document
from src.domain.ports.ocr import OcrPort
from src.domain.ports.pdf_generator import PdfGeneratorPort
from src.domain.ports.stt import SttPort
from src.domain.ports.vector_store import VectorStorePort
from src.infrastructure.utils.visual_verifier import VisualVerifier


class AgentState(TypedDict):
    input_file: Optional[Any]  # BinaryIO
    document_id: Optional[str]
    document: Optional[Document]
    reconstructed_pdf: Optional[bytes]
    similarity_score: float
    query: Optional[str]
    search_results: List[Any]
    response: str
    error: Optional[str]
    is_voice: bool
    current_template_id: Optional[str]
    collected_data: Dict[str, Any]
    missing_fields: List[str]


class LangGraphOrchestrator:
    def __init__(
        self,
        ocr: OcrPort,
        vector_store: VectorStorePort,
        pdf_gen: PdfGeneratorPort,
        stt: Optional[SttPort] = None,
    ):
        self.ocr = ocr
        self.vector_store = vector_store
        self.pdf_gen = pdf_gen
        self.stt = stt
        self.embeddings = OpenAIEmbeddings()
        self.llm = ChatOpenAI(model="gpt-4o-mini")
        self.workflow = self._create_workflow()

    def _create_workflow(self):
        workflow = StateGraph(AgentState)

        # Define Nodes
        workflow.add_node("ocr", self.ocr_node)
        workflow.add_node("stt", self.stt_node)
        workflow.add_node("reconstruct", self.reconstruct_node)
        workflow.add_node("verify", self.verify_node)
        workflow.add_node("index", self.index_node)
        workflow.add_node("search", self.search_node)
        workflow.add_node("respond", self.respond_node)
        workflow.add_node("selection", self.selection_node)
        workflow.add_node("gathering", self.gathering_node)
        workflow.add_node("preview", self.preview_node)

        # Define Edges
        workflow.set_conditional_entry_point(
            self.route_start,
            {"voice": "stt", "ocr": "ocr", "search": "search", "template": "selection"},
        )

        workflow.add_edge("stt", "search")
        workflow.add_edge("ocr", "reconstruct")
        workflow.add_edge("reconstruct", "verify")

        # Conditional Edge for Verification Loop
        workflow.add_conditional_edges(
            "verify",
            self.should_continue_refining,
            {"refine": "reconstruct", "next": "index"},
        )

        workflow.add_edge("selection", "gathering")
        workflow.add_conditional_edges(
            "gathering",
            self.should_preview,
            {"continue": "respond", "preview": "preview"},
        )

        workflow.add_edge("preview", "respond")
        workflow.add_edge("index", "respond")
        workflow.add_edge("search", "respond")
        workflow.add_edge("respond", END)

        return workflow.compile()

    def route_start(self, state: AgentState) -> str:
        query = str(state.get("query", "") or "").lower()
        if (
            "plantilla" in query
            or "template" in query
            or state.get("current_template_id")
        ):
            return "template"
        if state.get("is_voice"):
            return "voice"
        if state.get("input_file"):
            return "ocr"
        # Default: text-only query goes to semantic search
        return "search"

    def should_preview(self, state: AgentState) -> str:
        if not state.get("missing_fields"):
            return "preview"
        return "continue"

    async def selection_node(self, state: AgentState) -> AgentState:
        query = str(state.get("query", "") or "").lower()
        if not state.get("current_template_id"):
            # Primero intentamos búsqueda exacta por nombre
            template = await self.vector_store.get_template_by_name(query.upper())

            if not template:
                # Si no hay match exacto, usamos búsqueda semántica
                query_vec = await self.embeddings.aembed_query(query)
                results = await self.vector_store.search_templates(query_vec, limit=1)
                if results:
                    template = results[0]

            if template:
                return {
                    **state,
                    "current_template_id": template["name"],
                    "response": f"He encontrado la plantilla '{template['name']}'. ¿Es la que deseas usar?",
                }
            else:
                return {
                    **state,
                    "response": "No pude encontrar una plantilla que se ajuste a lo que buscas. ¿Podrías ser más específico?",
                }
        return state

    async def gathering_node(self, state: AgentState) -> AgentState:
        template_name = state.get("current_template_id")
        if not template_name:
            return state
        template = await self.vector_store.get_template_by_name(template_name)
        if not template:
            return {**state, "error": "Template not found"}

        schema_data = template.get("schema_data", {})
        required_fields: List[str] = (
            list(schema_data.get("required", []))
            if isinstance(schema_data, dict)
            else []
        )
        collected: Dict[str, Any] = state.get("collected_data", {})

        # El LLM extrae info del query
        missing = [str(f) for f in required_fields if f not in collected]

        if missing:
            next_field = missing[0]
            return {
                **state,
                "missing_fields": missing,
                "response": f"Por favor, dime el valor para: {next_field}",
            }

        return {**state, "missing_fields": []}

    async def preview_node(self, state: AgentState) -> AgentState:
        template_id = state.get("current_template_id")
        collected = state.get("collected_data")
        # Aquí llamaríamos a self.pdf_gen.generate_from_template
        return {
            **state,
            "response": f"He generado el borrador para {template_id}. ¿Deseas verlo?",
        }

    async def stt_node(self, state: AgentState) -> AgentState:
        if state.get("input_file") and self.stt:
            state["input_file"].seek(0)
            text = await self.stt.transcribe(state["input_file"])
            return {**state, "query": text}
        return state

    async def ocr_node(self, state: AgentState) -> AgentState:
        try:
            doc = await self.ocr.extract_text_with_layout(state["input_file"])
            return {**state, "document": doc}
        except Exception as e:
            return {**state, "error": str(e)}

    async def reconstruct_node(self, state: AgentState) -> AgentState:
        if not state.get("document"):
            return state
        pdf_bytes = await self.pdf_gen.generate_from_layout(
            state["document"].layout_data
        )
        return {**state, "reconstructed_pdf": pdf_bytes}

    async def verify_node(self, state: AgentState) -> AgentState:
        if not state.get("input_file") or not state.get("reconstructed_pdf"):
            return {**state, "similarity_score": 1.0}
        state["input_file"].seek(0)
        original_bytes = state["input_file"].read()
        score = VisualVerifier.compare_pdfs(original_bytes, state["reconstructed_pdf"])
        return {**state, "similarity_score": score}

    def should_continue_refining(self, state: AgentState) -> str:
        if state.get("similarity_score", 0) < 0.95:
            return "refine"
        return "next"

    async def index_node(self, state: AgentState) -> AgentState:
        doc = state["document"]
        if not doc:
            return state
        texts = [chunk.content for chunk in doc.chunks]
        if texts:
            embeddings = await self.embeddings.aembed_documents(texts)
            for chunk, emb in zip(doc.chunks, embeddings):
                chunk.embedding = emb

        await self.vector_store.save_document(doc)
        return {**state, "response": f"Document '{doc.title}' processed and indexed."}

    async def search_node(self, state: AgentState) -> AgentState:
        query = state.get("query")
        if not query:
            return state
        query_vec = await self.embeddings.aembed_query(query)
        results = await self.vector_store.search_chunks(query_vec)
        return {**state, "search_results": results}

    async def respond_node(self, state: AgentState) -> AgentState:
        # If we already have a response (from selection, gathering, etc.), just pass through
        if state.get("response") and not state.get("search_results"):
            return state

        query = state.get("query")
        results = state.get("search_results", [])
        if not query:
            return {**state, "response": state.get("response", "No query provided.")}

        if results:
            context = "\n".join([f"Page {c.page_number}: {c.content}" for c in results])
            prompt = f"Eres un asistente de documentos del Poder Judicial. Responde la siguiente pregunta basándote en el contexto proporcionado del repositorio documental.\n\nPregunta: {query}\n\nContexto:\n{context}"
        else:
            prompt = f"Eres un asistente de documentos del Poder Judicial. Responde de manera profesional y amable a lo siguiente: {query}"

        response = await self.llm.ainvoke(prompt)
        return {**state, "response": response.content}
