from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage
from src.infrastructure.adapters.agent.state import AgentState
from src.infrastructure.adapters.agent.tools import cli_preview_template, TemplateData
from src.infrastructure.config import Config

llm = ChatOpenAI(
    model=Config.LLM_MODEL, 
    api_key=Config.LLM_API_KEY,
    base_url=Config.LLM_BASE_URL
)

def get_selection_node(vector_store, embeddings):
    async def selection_node(state: AgentState) -> dict:
        messages = state.get("messages", [])
        if not messages: return state
        
        last_msg = messages[-1].content.lower()
        if not state.get("current_template_id"):
            # First attempt exact name match
            template = await vector_store.get_template_by_name(last_msg.upper())
            
            if not template:
                # Fallback to semantic search
                query_vec = await embeddings.aembed_query(last_msg)
                results = await vector_store.search_templates(query_vec, limit=1)
                if results:
                    template = results[0]
            
            if template:
                msg = f"He encontrado la plantilla '{template['name']}'. Vamos a empezar a completarla."
                return {
                    "current_template_id": template["name"],
                    "messages": [AIMessage(content=msg)],
                    "response": msg
                }
        return state
    return selection_node

def get_gathering_agent_node(vector_store):
    llm_with_tools = llm.bind_tools([cli_preview_template])
    
    async def gathering_node(state: AgentState) -> dict:
        template_name = state.get("current_template_id")
        if not template_name: return state
        
        template = await vector_store.get_template_by_name(template_name)
        if not template: return {"error": "Template not found"}
        
        schema = template.get("schema_data", {})
        collected = state.get("collected_data", {})
        messages = state.get("messages", [])

        # System prompt for gathering
        prompt = f"""Eres un asistente que captura datos para la plantilla: {template_name}.
Schema requerido: {schema}
Datos capturados hasta ahora: {collected}

Instrucciones:
1. Revisa los datos capturados contra el schema.
2. Si faltan datos, pídelos amablemente uno por uno.
3. Si el usuario proporciona datos, actualiza el estado (esto lo hace el orquestador, tú solo pregunta).
4. Ocasionalmente, usa 'cli_preview_template' para mostrar al usuario cómo va quedando el documento.
5. Cuando todos los campos requeridos estén llenos, confirma que has terminado.
"""
        # We prepend the system context to the messages for this turn
        full_messages = [AIMessage(content=prompt)] + messages
        
        response = await llm_with_tools.ainvoke(full_messages)
        
        output = {"messages": [response]}
        if not response.tool_calls:
            output["response"] = response.content
            
        # Update missing fields for the router
        required = schema.get("required", [])
        missing = [f for f in required if f not in collected]
        output["missing_fields"] = missing
        
        return output
        
    return gathering_node
