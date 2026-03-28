from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from src.infrastructure.adapters.agent.state import AgentState
from src.infrastructure.adapters.agent.subgraphs.template_graph.nodes import (
    get_selection_node,
    get_gathering_agent_node
)
from src.infrastructure.adapters.agent.tools import cli_preview_template

def build_template_graph(vector_store, embeddings):
    graph = StateGraph(AgentState)
    
    # Initialize nodes
    selection = get_selection_node(vector_store, embeddings)
    gathering = get_gathering_agent_node(vector_store)
    tool_node = ToolNode([cli_preview_template])
    
    graph.add_node("selection_node", selection)
    graph.add_node("gathering_node", gathering)
    graph.add_node("tools", tool_node)
    
    # Subgraph Flow
    graph.add_edge(START, "selection_node")
    graph.add_edge("selection_node", "gathering_node")
    
    # Agent Tool Loop within gathering
    graph.add_conditional_edges(
        "gathering_node",
        tools_condition,
        {
            "tools": "tools",
            "__end__": END
        }
    )
    graph.add_edge("tools", "gathering_node")
    
    return graph.compile()
