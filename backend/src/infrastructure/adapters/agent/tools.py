from typing import List, Optional
from langchain_core.tools import tool
from pydantic import BaseModel, Field

# --- Server Tools (srv_) ---

def get_server_tools(vector_store, embeddings):
    @tool
    async def srv_search_database(query: str, limit: int = 5) -> str:
        """
        Searches the SQL semantic database for relevant document chunks based on the user's query.
        Call this tool whenever you need to look up facts, legal principles, case numbers, or clauses.
        """
        try:
            query_vec = await embeddings.aembed_query(query)
            results = await vector_store.search_chunks(query_vec, limit)
            if not results:
                return "No results found in the document database for this query."
            
            context = "\n".join([f"Page {c.page_number} ({c.id}): {c.content}" for c in results])
            return context
        except Exception as e:
            return f"Error executing search: {str(e)}"
            
    return [srv_search_database]

# --- Client Tools (cli_) ---

class DocumentReference(BaseModel):
    document_id: str = Field(description="The UUID of the document")
    title: str = Field(description="The title of the document")

@tool
def cli_show_documents(documents: List[DocumentReference]) -> str:
    """
    CLIENT TOOL: Displays a list of documents in the user's frontend UI. 
    Call this tool when you have found relevant documents that the user should read or select from.
    DO NOT wait for the output of this tool, it is handled asynchronously by the client UI.
    """
    return "Action queued for client."

class TemplateData(BaseModel):
    template_id: str = Field(description="The UUID of the template")
    current_data: dict = Field(description="Key-value pairs of the extracted data for the template so far")

@tool
def cli_preview_template(template_data: TemplateData) -> str:
    """
    CLIENT TOOL: Previews the current draft of the template in the user's frontend UI.
    Call this tool occasionally to show the user how the document is being filled out.
    """
    return "Action queued for client."
