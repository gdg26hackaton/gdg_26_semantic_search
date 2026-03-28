from abc import ABC, abstractmethod
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class MessageInputDTO(BaseModel):
    message: str
    is_template_message: bool = False
    template_type: str | None = None
    media_data: Optional[Dict[str, Any]] = None
    
class ClientAction(BaseModel):
    action_type: str
    payload: Dict[str, Any]

class AgentResult(BaseModel):
    message: str
    conversation_id: str
    client_actions: List[ClientAction] = Field(default_factory=list)
    missing_fields: List[str] = Field(default_factory=list)
    reconstructed_pdf: Optional[bytes] = None
    similarity_score: Optional[float] = None
    similarity_threshold_met: bool = True

class IAgentService(ABC):
    @abstractmethod
    async def invoke_agent(
        self,
        thread_id: str,
        user_messages: List[MessageInputDTO],
        input_file: Any = None
    ) -> AgentResult:
        """Invokes the LangGraph agent securely via generic DTOs."""
        pass
