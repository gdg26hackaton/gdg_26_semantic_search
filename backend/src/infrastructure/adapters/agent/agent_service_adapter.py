import asyncio
from typing import List, Optional, Any
from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings

from src.domain.ports.agent_service import IAgentService, AgentResult, MessageInputDTO, ClientAction
from src.infrastructure.adapters.agent.global_graph import build_global_graph
from src.infrastructure.config import Config

class AgentServiceAdapter(IAgentService):
    def __init__(self, ocr_adapter, db_adapter, pdf_adapter):
        self.embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        # Ensure we pass None or remote it from graph builder if we updated global_graph.py
        self.graph = build_global_graph(ocr_adapter, db_adapter, pdf_adapter, None, self.embeddings)

    async def invoke_agent(
        self,
        thread_id: str,
        user_messages: List[MessageInputDTO],
        input_file: Any = None
    ) -> AgentResult:
        
        # 1. Translate raw DTOs to LangChain HumanMessages
        formatted_messages = []
        raw_query = ""
        for dto in user_messages:
            content = dto.message
            if dto.is_template_message and dto.template_type:
                content += f" (Template: {dto.template_type})"
            formatted_messages.append(HumanMessage(content=content))
            raw_query += content + " "

        raw_query = raw_query.strip()
        
        # 2. Formulate State Input
        config = {"configurable": {"thread_id": thread_id}}
        
        # Determine if it's a template route by checking current input DTOs
        sent_to_template = any(m.is_template_message for m in user_messages)
        template_type = next((m.template_type for m in user_messages if m.template_type), None)

        graph_input = {
            "messages": formatted_messages,
            "conversation_id": thread_id,
            "query": raw_query,
            "input_file": input_file
        }
        
        if sent_to_template and template_type:
            graph_input["current_template_id"] = template_type

        # 4. Invoke LangGraph
        result_state = await self.graph.ainvoke(graph_input, config=config)
        
        # 5. Intercept Dual-Tools (Client Actions)
        messages = result_state.get("messages", [])
        client_actions: List[ClientAction] = []
        
        # Scan only the new messages generated in this turn
        last_human_idx = -1
        for i in range(len(messages) - 1, -1, -1):
            if isinstance(messages[i], HumanMessage):
                last_human_idx = i
                break
                
        if last_human_idx != -1:
            for msg in messages[last_human_idx + 1:]:
                if isinstance(msg, AIMessage) and hasattr(msg, "tool_calls"):
                    for tc in getattr(msg, "tool_calls", []):
                        if tc["name"].startswith("cli_"):
                            client_actions.append(ClientAction(
                                tool_name=tc["name"],
                                payload=tc["args"]
                            ))

        # 6. Map back to Output DTO
        response_text = result_state.get("response", "Lo siento, hubo un error procesando la solicitud.")
        
        # Fallback: if 'response' is empty but the LLM provided text in the last message
        if (not response_text or response_text == "Lo siento, hubo un error procesando la solicitud.") and messages:
            last_msg = messages[-1]
            if isinstance(last_msg, AIMessage) and last_msg.content:
                response_text = str(last_msg.content)

        missing_fields = result_state.get("missing_fields", [])
        similarity_score = result_state.get("similarity_score")
        reconstructed_pdf = result_state.get("reconstructed_pdf")
        
        return AgentResult(
            message=response_text,
            conversation_id=thread_id,
            missing_fields=missing_fields,
            reconstructed_pdf=reconstructed_pdf,
            similarity_score=similarity_score,
            similarity_threshold_met=True,
            client_actions=client_actions
        )
