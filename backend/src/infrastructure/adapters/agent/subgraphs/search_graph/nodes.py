from langchain_core.messages import AIMessage
from langchain_openai import ChatOpenAI
from src.infrastructure.adapters.agent.state import AgentState
from src.infrastructure.adapters.agent.tools import get_server_tools, cli_show_documents
from src.infrastructure.config import Config

llm = ChatOpenAI(
    model=Config.LLM_MODEL, 
    api_key=Config.LLM_API_KEY,
    base_url=Config.LLM_BASE_URL
)

def get_agent_node(vector_store, embeddings):
    tools = get_server_tools(vector_store, embeddings) + [cli_show_documents]
    llm_with_tools = llm.bind_tools(tools)
    
    async def agent_node(state: AgentState) -> dict:
        # If there's already a response from a previous subgraph (like template), pass it through
        if state.get("response"):
            return state

        # Seed instructions if this is the first execution without system messages
        from langchain_core.messages import SystemMessage
        messages = state.get("messages", [])
        
        system_prompt = "Eres un asistente de búsqueda semántica local. Busca documentos en la base de datos antes de responder."
        if not any(isinstance(msg, SystemMessage) for msg in messages):
            messages = [SystemMessage(content=system_prompt)] + messages
            
        response = await llm_with_tools.ainvoke(messages)
        
        output_state = {"messages": [response]}
        
        # Output extraction for standard Agent ports
        if not response.tool_calls and response.content:
            output_state["response"] = response.content
            
        return output_state
        
    return agent_node
