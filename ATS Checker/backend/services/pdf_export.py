import io
import logging

try:
    from weasyprint import HTML
    WEASYPRINT_INSTALLED = True
except (ImportError, OSError):
    WEASYPRINT_INSTALLED = False

try:
    from xhtml2pdf import pisa
    XHTML2PDF_INSTALLED = True
except ImportError:
    XHTML2PDF_INSTALLED = False

logger = logging.getLogger('ats_resume_scorer')

def generate_combined_pdf(html_docs: dict[str, str]) -> bytes:
    if not WEASYPRINT_INSTALLED and not XHTML2PDF_INSTALLED:
        raise ImportError("Neither WeasyPrint (with GTK) nor xhtml2pdf is available. PDF generation is unavailable.")

    # Check if the single unified PDF report is available
    if 'pdf_report' in html_docs:
        html_str = html_docs['pdf_report']
        
        if WEASYPRINT_INSTALLED:
            try:
                logger.info("Generating PDF using WeasyPrint (Single Unified Report)...")
                return HTML(string=html_str).write_pdf()
            except Exception as e:
                logger.warning(f"WeasyPrint failed to render single PDF: {e}. Falling back to xhtml2pdf.")
                
        if XHTML2PDF_INSTALLED:
            logger.info("Generating PDF using xhtml2pdf (Single Unified Report)...")
            pdf_buffer = io.BytesIO()
            pisa_status = pisa.CreatePDF(html_str, dest=pdf_buffer)
            if not pisa_status.err:
                return pdf_buffer.getvalue()
            else:
                raise RuntimeError(f"xhtml2pdf failed to generate PDF: {pisa_status.err}")

    # Legacy fallback behavior (combining 4 reports)
    if WEASYPRINT_INSTALLED:
        try:
            logger.info("Generating combined PDF using WeasyPrint (Legacy Merge)...")
            documents = []
            for name, html_str in html_docs.items():
                if name == 'pdf_report':
                    continue
                doc = HTML(string=html_str).render()
                documents.append(doc)
            
            first_doc = documents[0]
            for other_doc in documents[1:]:
                for page in other_doc.pages:
                    first_doc.pages.append(page)
                    
            return first_doc.write_pdf()
        except Exception as e:
            logger.warning(f"WeasyPrint legacy failed: {e}. Falling back to xhtml2pdf.")

    if XHTML2PDF_INSTALLED:
        logger.info("Generating combined PDF using xhtml2pdf (Legacy Merge)...")
        combined_html = ""
        for name, html_str in html_docs.items():
            if name == 'pdf_report':
                continue
            if combined_html:
                combined_html += '<div style="page-break-before: always;"></div>'
            combined_html += html_str
        
        pdf_buffer = io.BytesIO()
        pisa_status = pisa.CreatePDF(combined_html, dest=pdf_buffer)
        if not pisa_status.err:
            return pdf_buffer.getvalue()
        else:
            raise RuntimeError(f"xhtml2pdf legacy failed: {pisa_status.err}")

    raise ImportError("Failed to generate PDF.")