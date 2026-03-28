from langgraph.graph import StateGraph, START, END
from src.infrastructure.adapters.agent.state import AgentState
from src.infrastructure.adapters.agent.subgraphs.search_graph.graph import build_search_graph
from src.infrastructure.adapters.agent.subgraphs.template_graph.graph import build_template_graph
from src.infrastructure.adapters.agent.subgraphs.ingestion_graph.graph import build_ingestion_graph

def clear_state_node(state: AgentState) -> dict:
    """Clears one-shot output fields from the state to ensure fresh results each turn."""
    return {
        "response": None,
        "reconstructed_pdf": None,
        "search_results": []
    }

def route_entry(state: AgentState) -> str:
    """Routes initial input to the appropriate specialized subgraph."""
    query = str(state.get("query", "") or "").lower()
    last_msg = state.get("messages", [])[-1].content.lower() if state.get("messages") else ""
    
    # Priority 1: Ingestion if file is present
    if state.get("input_file"):
        return "ingestion"
        
    # Priority 2: Template if keywords present OR already in a template session
    # UNLESS the user specifically asks to "buscar", "encontrar", etc.
    search_keywords = ["busca", "encontrar", "search", "find", "consulta", "quien", "cuando", "donde"]
    is_asking_search = any(kw in query for kw in search_keywords)
    
    if ("plantilla" in query or "template" in query or state.get("current_template_id")) and not is_asking_search:
        return "template"
    
    return "search"

from langgraph.checkpoint.memory import MemorySaver

def build_global_graph(ocr, db_adapter, pdf_gen, stt_adapter, embeddings):
    """Compiles the root routing graph that unites all subgraphs."""
    graph = StateGraph(AgentState)
    
    # Pre-compile the subgraphs with injected dependencies
    search_subgraph = build_search_graph(db_adapter, embeddings)
    template_subgraph = build_template_graph(db_adapter, embeddings)
    ingestion_subgraph = build_ingestion_graph(ocr, db_adapter, embeddings)
    
    graph.add_node("clear_state", clear_state_node)
    graph.add_node("search_agent", search_subgraph)
    graph.add_node("template_agent", template_subgraph)
    graph.add_node("ingestion_agent", ingestion_subgraph)
    
    graph.add_edge(START, "clear_state")
    
    graph.add_conditional_edges(
        "clear_state",
        route_entry,
        {
            "search": "search_agent",
            "template": "template_agent",
            "ingestion": "ingestion_agent"
        }
    )
    
    # All subgraphs flow to END when finished
    graph.add_edge("search_agent", END)
    graph.add_edge("template_agent", END)
    graph.add_edge("ingestion_agent", END)
    
    checkpointer = MemorySaver()
    return graph.compile(checkpointer=checkpointer)
