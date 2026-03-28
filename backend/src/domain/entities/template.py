from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Any
from uuid import UUID, uuid4

@dataclass
class Template:
    id: UUID = field(default_factory=uuid4)
    name: str = ""
    html_content: str = "" # The base HTML/CSS template for Playwright
    data_schema: Dict[str, Any] = field(default_factory=dict) # Expected JSON structure
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
