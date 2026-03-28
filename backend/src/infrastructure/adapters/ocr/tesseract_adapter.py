import pytesseract
from pdf2image import convert_from_bytes
from typing import BinaryIO, List
from src.domain.entities.document import Document, DocumentChunk, BoundingBox
from src.domain.ports.ocr import OcrPort
import bs4
import io

class TesseractOcrAdapter(OcrPort):
    async def extract_text_with_layout(self, file: BinaryIO) -> Document:
        file_bytes = file.read()
        images = convert_from_bytes(file_bytes)
        
        document = Document()
        all_elements = []
        
        for i, image in enumerate(images):
            # Get hOCR data from Tesseract
            hocr_data = pytesseract.image_to_pdf_or_hocr(image, extension='hocr')
            soup = bs4.BeautifulSoup(hocr_data, 'html.parser')
            
            # Parse hOCR for words and their bounding boxes
            # This is a simplified version; real hOCR parsing is more involved
            words = soup.find_all('span', class_='ocrx_word')
            page_text = []
            
            for word in words:
                text = word.get_text().strip()
                if not text: continue
                
                # Extract bbox: "bbox x0 y0 x1 y1"
                title = word.get('title', '')
                parts = title.split(';')
                bbox_part = next((p for p in parts if 'bbox' in p), None)
                if bbox_part:
                    coords = [int(x) for x in bbox_part.replace('bbox ', '').split()]
                    bbox = BoundingBox(x=coords[0], y=coords[1], width=coords[2]-coords[0], height=coords[3]-coords[1])
                    
                    document.chunks.append(DocumentChunk(
                        content=text,
                        page_number=i+1,
                        bbox=bbox
                    ))
                    
                    all_elements.append({
                        "text": text,
                        "x": bbox.x,
                        "y": bbox.y,
                        "width": bbox.width,
                        "height": bbox.height,
                        "font_size": 12 # Default for now
                    })
                    page_text.append(text)
        
        document.layout_data = {"elements": all_elements}
        return document
