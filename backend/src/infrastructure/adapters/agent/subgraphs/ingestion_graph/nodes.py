from src.infrastructure.adapters.agent.state import AgentState

def get_ocr_node(ocr):
    async def ocr_node(state: AgentState) -> AgentState:
        try:
            doc = await ocr.extract_text_with_layout(state["input_file"])
            return {**state, "document": doc}
        except Exception as e:
            return {**state, "error": str(e)}
    return ocr_node

def get_index_node(vector_store, embeddings):
    async def index_node(state: AgentState) -> AgentState:
        doc = state.get("document")
        if not doc: return state
        
        texts = [chunk.content for chunk in doc.chunks]
        if texts:
            embedded_vectors = await embeddings.aembed_documents(texts)
            for chunk, emb in zip(doc.chunks, embedded_vectors):
                chunk.embedding = emb
        
        await vector_store.save_document(doc)
        return {**state, "response": f"Document '{doc.title}' processed and indexed successfully."}
    return index_node
