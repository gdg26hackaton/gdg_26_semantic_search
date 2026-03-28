from langgraph.graph import StateGraph, START, END
from src.infrastructure.adapters.agent.state import AgentState
from src.infrastructure.adapters.agent.subgraphs.ingestion_graph.nodes import (
    get_ocr_node, get_index_node
)

def build_ingestion_graph(ocr, vector_store, embeddings):
    graph = StateGraph(AgentState)
    
    # Initialize nodes
    ocr_node = get_ocr_node(ocr)
    index = get_index_node(vector_store, embeddings)
    
    graph.add_node("ocr_node", ocr_node)
    graph.add_node("index_node", index)
    
    # Wiring
    graph.add_edge(START, "ocr_node")
    graph.add_edge("ocr_node", "index_node")
    graph.add_edge("index_node", END)
    
    return graph.compile()
