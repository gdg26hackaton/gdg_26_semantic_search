import uuid
from typing import List

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from src.domain.ports.agent_service import IAgentService, MessageInputDTO

router = APIRouter()

@router.get("/ws/status")
async def get_status():
    return {"status": "ok", "agent_ready": _agent_service is not None}

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)


manager = ConnectionManager()
_agent_service: IAgentService | None = None


def init_router(agent: IAgentService):
    global _agent_service
    _agent_service = agent


@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    thread_id = str(uuid.uuid4())
    try:
        while True:
            try:
                data = await websocket.receive_json()
            except WebSocketDisconnect:
                raise # Re-raise to be caught by the outer block
            except Exception as e:
                print(f"⚠️ WS Protocol Error: {e}")
                break # Break loop on unexpected protocol error

            if not _agent_service:
                await websocket.send_json({"type": "error", "message": "Agent offline."})
                continue

            user_msg = data.get("message", "") if isinstance(data, dict) else str(data)
            dto = MessageInputDTO(message=user_msg)
            
            result = await _agent_service.invoke_agent(thread_id, [dto])

            if result.message:
                await websocket.send_json({
                    "type": "chat",
                    "content": result.message # Sincronizado con useAgent.ts
                })

            if result.client_actions:
                for action in result.client_actions:
                    await websocket.send_json({
                        "type": "client_action",
                        "action": { # Sincronizado con useAgent.ts
                            "tool": action.action_type,
                            "tool_input": action.payload
                        }
                    })

            # Existing generic handlers
            if result.reconstructed_pdf:
                await websocket.send_json({
                    "type": "system",
                    "message": "PDF file generated."
                })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
