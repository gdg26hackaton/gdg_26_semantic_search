import asyncio
import os
import uuid

import psycopg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://rag_agent:123456@localhost:5432/vectorial_db"
)


async def seed_templates():
    templates = [
        {
            "id": str(uuid.uuid4()),
            "name": "NDA",
            "content": """
                <html>
                <head><style>body { font-family: sans-serif; padding: 50px; }</style></head>
                <body>
                    <h1>Non-Disclosure Agreement</h1>
                    <p>This agreement is made between <b>{{ party_a }}</b> and <b>{{ party_b }}</b> on {{ date }}.</p>
                    <p>Both parties agree to keep all information confidential.</p>
                </body>
                </html>
            """,
            "schema_data": {
                "type": "object",
                "properties": {
                    "party_a": {"type": "string"},
                    "party_b": {"type": "string"},
                    "date": {"type": "string", "format": "date"},
                },
                "required": ["party_a", "party_b", "date"],
            },
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Invoice",
            "content": """
                <html>
                <body>
                    <h1>Invoice #{{ invoice_number }}</h1>
                    <p>Customer: {{ customer_name }}</p>
                    <p>Amount: ${{ amount }}</p>
                </body>
                </html>
            """,
            "schema_data": {
                "type": "object",
                "properties": {
                    "invoice_number": {"type": "string"},
                    "customer_name": {"type": "string"},
                    "amount": {"type": "number"},
                },
                "required": ["invoice_number", "customer_name", "amount"],
            },
        },
    ]

    from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
    embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")

    async with await psycopg.AsyncConnection.connect(DATABASE_URL) as conn:
        async with conn.cursor() as cur:
            for t in templates:
                import json
                # Generate embedding for the template name/purpose
                description = f"{t['name']} - Schema: {json.dumps(t['schema_data'])}"
                emb = await embeddings.aembed_query(description)

                await cur.execute(
                    "INSERT INTO templates (id, name, content, schema_data, embedding) VALUES (%s, %s, %s, %s, %s) "
                    "ON CONFLICT (name) DO UPDATE SET content = EXCLUDED.content, schema_data = EXCLUDED.schema_data, embedding = EXCLUDED.embedding",
                    (t["id"], t["name"], t["content"], json.dumps(t["schema_data"]), emb),
                )
            await conn.commit()
            print("Templates seeded successfully with 384-dim embeddings.")


if __name__ == "__main__":
    asyncio.run(seed_templates())
