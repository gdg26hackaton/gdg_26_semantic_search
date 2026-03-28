import psycopg
from pgvector.psycopg import register_vector_async
from typing import List, Optional, Dict, Any
from uuid import UUID
from src.domain.entities.document import Document, DocumentChunk, BoundingBox
from src.domain.ports.vector_store import VectorStorePort
import os
import json

class PgVectorAdapter(VectorStorePort):
    def __init__(self, connection_url: str):
        self.connection_url = connection_url
        self.conn = None

    async def _get_conn(self):
        if not self.conn:
            self.conn = await psycopg.AsyncConnection.connect(self.connection_url)
            await register_vector_async(self.conn)
        return self.conn

    async def initialize_db(self):
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            await register_vector_async(conn)
            
            async with conn.cursor() as cur:
                await cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
                await cur.execute("""
                    CREATE TABLE IF NOT EXISTS documents (
                        id UUID PRIMARY KEY,
                        title TEXT,
                        file_path TEXT,
                        layout_data JSONB,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                await cur.execute("""
                    CREATE TABLE IF NOT EXISTS document_chunks (
                        id UUID PRIMARY KEY,
                        document_id UUID REFERENCES documents(id),
                        content TEXT,
                        page_number INTEGER,
                        bbox JSONB,
                        embedding vector(384), 
                        metadata JSONB
                    )
                """)
                await cur.execute("""
                    CREATE TABLE IF NOT EXISTS templates (
                        id UUID PRIMARY KEY,
                        name TEXT UNIQUE,
                        content TEXT,
                        schema_data JSONB,
                        embedding vector(384),
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                await conn.commit()

    async def save_template(self, template: Dict[str, Any]) -> None:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            await register_vector_async(conn)
            async with conn.cursor() as cur:
                await cur.execute(
                    "INSERT INTO templates (id, name, content, schema_data, embedding) VALUES (%s, %s, %s, %s, %s) "
                    "ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding, schema_data = EXCLUDED.schema_data",
                    (template["id"], template["name"], template["content"], json.dumps(template["schema_data"]), template.get("embedding"))
                )
                await conn.commit()

    async def list_templates(self, limit: int = 20) -> List[Dict[str, Any]]:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT id, name, content, schema_data FROM templates ORDER BY created_at DESC LIMIT %s", (limit,))
                rows = await cur.fetchall()
                return [{"id": r[0], "name": r[1], "content": r[2], "schema_data": r[3]} for r in rows]

    async def search_templates(self, query_vector: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            await register_vector_async(conn)
            async with conn.cursor() as cur:
                await cur.execute(
                    "SELECT id, name, content, schema_data FROM templates ORDER BY embedding <=> %s::vector LIMIT %s",
                    (query_vector, limit)
                )
                rows = await cur.fetchall()
                return [{"id": r[0], "name": r[1], "content": r[2], "schema_data": r[3]} for r in rows]

    async def save_document(self, document: Document) -> None:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            await register_vector_async(conn)
            async with conn.cursor() as cur:
                await cur.execute(
                    "INSERT INTO documents (id, title, file_path, layout_data) VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, layout_data = EXCLUDED.layout_data",
                    (document.id, document.title, document.file_path, json.dumps(document.layout_data))
                )
                for chunk in document.chunks:
                    await cur.execute(
                        """INSERT INTO document_chunks (id, document_id, content, page_number, bbox, embedding, metadata) 
                           VALUES (%s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding""",
                        (chunk.id, document.id, chunk.content, chunk.page_number, 
                         json.dumps(vars(chunk.bbox) if chunk.bbox else None), 
                         chunk.embedding, json.dumps(chunk.metadata))
                    )
                await conn.commit()

    async def search_chunks(self, query_vector: List[float], limit: int = 5) -> List[DocumentChunk]:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            await register_vector_async(conn)
            async with conn.cursor() as cur:
                await cur.execute(
                    "SELECT id, content, page_number, bbox, metadata FROM document_chunks ORDER BY embedding <=> %s::vector LIMIT %s",
                    (query_vector, limit)
                )
                rows = await cur.fetchall()
                chunks = []
                for row in rows:
                    bbox_data = row[3]
                    bbox = BoundingBox(**bbox_data) if bbox_data else None
                    chunks.append(DocumentChunk(
                        id=row[0],
                        content=row[1],
                        page_number=row[2],
                        bbox=bbox,
                        metadata=row[4]
                    ))
                return chunks

    async def get_document(self, document_id: UUID) -> Optional[Document]:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT id, title, file_path, layout_data FROM documents WHERE id = %s", (document_id,))
                row = await cur.fetchone()
                if not row: return None
                return Document(id=row[0], title=row[1], file_path=row[2], layout_data=row[3])
                
    async def list_documents(self, limit: int = 20) -> List[Document]:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT id, title, file_path, layout_data FROM documents ORDER BY created_at DESC LIMIT %s", (limit,))
                rows = await cur.fetchall()
                return [Document(id=r[0], title=r[1], file_path=r[2], layout_data=r[3]) for r in rows]

    async def delete_document(self, document_id: UUID) -> None:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            async with conn.cursor() as cur:
                # Cascade deletion should handle document_chunks if foreign key is set correctly
                await cur.execute("DELETE FROM documents WHERE id = %s", (document_id,))
                await conn.commit()

    async def get_template_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT id, name, content, schema_data FROM templates WHERE name = %s", (name,))
                row = await cur.fetchone()
                if not row: return None
                return {"id": row[0], "name": row[1], "content": row[2], "schema_data": row[3]}

    async def delete_template(self, name: str) -> None:
        async with await psycopg.AsyncConnection.connect(self.connection_url) as conn:
            async with conn.cursor() as cur:
                await cur.execute("DELETE FROM templates WHERE name = %s", (name,))
                await conn.commit()
