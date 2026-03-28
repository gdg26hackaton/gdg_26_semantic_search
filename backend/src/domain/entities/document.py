from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4

@dataclass
class BoundingBox:
    x: float
    y: float
    width: float
    height: float

@dataclass
class DocumentChunk:
    id: UUID = field(default_factory=uuid4)
    content: str = ""
    page_number: int = 1
    bbox: Optional[BoundingBox] = None
    embedding: Optional[List[float]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class Document:
    id: UUID = field(default_factory=uuid4)
    title: str = ""
    file_path: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    chunks: List[DocumentChunk] = field(default_factory=list)
    layout_data: Dict[str, Any] = field(default_factory=dict) # Full hOCR/JSON layout
