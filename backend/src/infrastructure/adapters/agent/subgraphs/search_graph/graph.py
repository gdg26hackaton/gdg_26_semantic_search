from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from src.infrastructure.adapters.agent.state import AgentState
from src.infrastructure.adapters.agent.subgraphs.search_graph.nodes import get_agent_node
from src.infrastructure.adapters.agent.tools import get_server_tools, cli_show_documents

def build_search_graph(vector_store, embeddings):
    graph = StateGraph(AgentState)
    
    # Instantiate Tools Node
    tools = get_server_tools(vector_store, embeddings) + [cli_show_documents]
    tool_node = ToolNode(tools)
    
    # Get the LLM node bound with tools
    agent = get_agent_node(vector_store, embeddings)
    
    graph.add_node("agent", agent)
    graph.add_node("tools", tool_node)
    
    # Agentic Tool Loop (ReAct style)
    graph.add_edge(START, "agent")
    
    # Condition: If the agent decides to use a tool, go to "tools". Otherwise END.
    graph.add_conditional_edges("agent", tools_condition)
    
    # After a tool executes, return to the agent to summarize or act on the results
    graph.add_edge("tools", "agent")
    
    return graph.compile()
