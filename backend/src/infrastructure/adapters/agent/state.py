import operator
from typing import Annotated, Any, Dict, List, Optional, TypedDict
from langchain_core.messages import BaseMessage
from src.domain.entities.document import Document

class AgentState(TypedDict):
    # Chat & Core
    messages: Annotated[List[BaseMessage], operator.add]
    conversation_id: str
    query: Optional[str]
    input_file: Any
    is_voice: bool
    
    # Template Filling State
    current_template_id: Optional[str]
    collected_data: Dict[str, Any]
    missing_fields: List[str]
    
    # RAG / Search State
    search_results: List[Any]
    
    # Ingestion & Vision State
    document: Optional[Document]
    reconstructed_pdf: Optional[bytes]
    similarity_score: float
    
    # Output to user
    response: Optional[str]
