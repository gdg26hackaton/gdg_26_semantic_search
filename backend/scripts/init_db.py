import asyncio
import os

import psycopg
from dotenv import load_dotenv
from pgvector.psycopg import register_vector
from psycopg.rows import dict_row

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://rag_agent:123456@localhost:5432/vectorial_db"
)


async def init_db():
    print(f"Connecting to {DATABASE_URL}...")
    async with await psycopg.AsyncConnection.connect(DATABASE_URL) as conn:
        async with conn.cursor() as cur:
            # Enable pgvector
            await cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")

            # Clean up old dimensional schemas
            print("Purging existing tables for clean initialization...")
            await cur.execute("DROP TABLE IF EXISTS document_chunks CASCADE;")
            await cur.execute("DROP TABLE IF EXISTS documents CASCADE;")
            await cur.execute("DROP TABLE IF EXISTS templates CASCADE;")

            # Create documents table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id UUID PRIMARY KEY,
                    title TEXT NOT NULL,
                    file_path TEXT,
                    layout_data JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Create document_chunks table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS document_chunks (
                    id UUID PRIMARY KEY,
                    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
                    content TEXT NOT NULL,
                    page_number INTEGER,
                    bbox JSONB,
                    embedding vector(384),
                    metadata JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Create templates table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS templates (
                    id UUID PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    content TEXT NOT NULL,
                    schema_data JSONB,
                    embedding vector(384),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            await conn.commit()
            print("Database initialized successfully.")


if __name__ == "__main__":
    asyncio.run(init_db())
