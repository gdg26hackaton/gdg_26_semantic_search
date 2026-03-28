import asyncio
import os
import sys
import uuid
from typing import Any, Dict

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.domain.ports.agent_service import MessageInputDTO
from src.infrastructure.adapters.agent.agent_service_adapter import AgentServiceAdapter
from src.infrastructure.adapters.db.pgvector_adapter import PgVectorAdapter
from src.infrastructure.adapters.ocr.tesseract_adapter import TesseractOcrAdapter
from src.infrastructure.adapters.pdf.playwright_adapter import PlaywrightPdfAdapter
from src.infrastructure.config import Config


async def main():
    print("\n--- 🤖 Semantic Document Agent Console ---")
    print("Type 'exit' to quit.\n")

    # 1. Initialize Infrastructure Adapters
    db_adapter = PgVectorAdapter(Config.DATABASE_URL)
    ocr_adapter = TesseractOcrAdapter()
    pdf_adapter = PlaywrightPdfAdapter()

    # Ensure DB is ready
    await db_adapter.initialize_db()

    # 2. Initialize the isolated Agent Service Port
    agent = AgentServiceAdapter(
        ocr_adapter=ocr_adapter,
        db_adapter=db_adapter,
        pdf_adapter=pdf_adapter
    )

    # Session state
    thread_id = str(uuid.uuid4())
    print(f"[Session ID: {thread_id}]")

    while True:
        try:
            user_input = input("\nUser: ").strip()
            if user_input.lower() in ["exit", "quit", "q"]:
                break

            if not user_input:
                continue

            print("Agent: Thinking...")

            # Format input
            dto = MessageInputDTO(message=user_input)

            # Invoke
            result = await agent.invoke_agent(thread_id, [dto])

            # Display Agent Response
            if result.message:
                print(f"Agent: {result.message}")

            if result.reconstructed_pdf:
                print(
                    f"Agent: [SYSTEM] Generated PDF (content length: {len(result.reconstructed_pdf)})"
                )

        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}")
            import traceback

            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
