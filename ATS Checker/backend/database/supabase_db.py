import logging
import httpx
import json
import sqlite3
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict

logger = logging.getLogger('ats_resume_scorer')

from backend.core.config import SUPABASE_URL, SUPABASE_KEY

DB_PATH = os.path.join(os.path.dirname(__file__), 'local_history.db')

def _init_sqlite_db():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analyses (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                filename TEXT,
                ats_score REAL,
                keyword_match REAL,
                missing_keywords TEXT,
                created_at TEXT,
                analysis_result TEXT
            )
        ''')
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Failed to initialize local SQLite database: {e}")

def _get_sqlite_conn():
    _init_sqlite_db()
    return sqlite3.connect(DB_PATH)

def _get_headers():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }


async def save_analysis(user_id: str, filename: str, analysis_result: Dict) -> Optional[str]:
    headers = _get_headers()
    if not headers:
        try:
            analysis_id = str(uuid.uuid4())
            def _json_default(o):
                if hasattr(o, 'model_dump'):
                    return o.model_dump()
                return str(o)
            serializable_result = json.loads(json.dumps(analysis_result, default=_json_default))
            
            ats_score = serializable_result.get("ats_score", 0)
            keyword_match = serializable_result.get("keyword_match", 0)
            missing_keywords = json.dumps(serializable_result.get("missing_keywords", []))
            created_at = datetime.now(timezone.utc).isoformat()
            result_str = json.dumps(serializable_result)
            
            conn = _get_sqlite_conn()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO analyses (id, user_id, filename, ats_score, keyword_match, missing_keywords, created_at, analysis_result) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (analysis_id, user_id, filename, ats_score, keyword_match, missing_keywords, created_at, result_str)
            )
            conn.commit()
            conn.close()
            logger.info(f"Saved analysis to local SQLite for user {user_id}: {analysis_id}")
            return analysis_id
        except Exception as exc:
            logger.error(f"Failed to save analysis to local SQLite: {exc}")
            return None

    def _json_default(o):
        if hasattr(o, 'model_dump'):
            return o.model_dump()
        return str(o)
    serializable_result = json.loads(json.dumps(analysis_result, default=_json_default))

    doc = {
        "user_id": user_id,
        "filename": filename,
        "ats_score": serializable_result.get("ats_score", 0),
        "keyword_match": serializable_result.get("keyword_match", 0),
        "missing_keywords": serializable_result.get("missing_keywords", []),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "analysis_result": serializable_result,
    }

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=doc)
            response.raise_for_status()
            data = response.json()
            if data and len(data) > 0:
                inserted_id = str(data[0].get("id"))
                logger.info(f"Saved analysis to Supabase for user {user_id}: {inserted_id}")
                return inserted_id
            return None
    except Exception as exc:
        logger.error(f"Failed to save analysis to Supabase: {exc}")
        return None

async def get_user_history(user_id: str) -> List[Dict]:
    headers = _get_headers()
    if not headers:
        try:
            conn = _get_sqlite_conn()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, filename, ats_score, keyword_match, missing_keywords, created_at, analysis_result FROM analyses WHERE user_id = ? ORDER BY created_at DESC",
                (user_id,)
            )
            rows = cursor.fetchall()
            conn.close()
            
            results = []
            for row in rows:
                row_id, filename, ats_score, keyword_match, missing_keywords_str, created_at, result_str = row
                try:
                    missing_keywords = json.loads(missing_keywords_str)
                except Exception:
                    missing_keywords = []
                try:
                    analysis_result = json.loads(result_str)
                except Exception:
                    analysis_result = {}
                    
                results.append({
                    "id": row_id,
                    "filename": filename,
                    "resume_name": filename,
                    "job_title": "Software Engineer",
                    "ats_score": ats_score,
                    "keyword_match": keyword_match,
                    "missing_keywords": missing_keywords,
                    "date": created_at,
                    "created_at": created_at,
                    "analysis_result": analysis_result,
                })
            return results
        except Exception as exc:
            logger.error(f"Failed to fetch history from local SQLite: {exc}")
            return []

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url, 
                headers=headers, 
                params={
                    "user_id": f"eq.{user_id}",
                    "order": "created_at.desc"
                }
            )
            response.raise_for_status()
            docs = response.json()
            
            results = []
            for doc in docs:
                results.append({
                    "id": str(doc.get("id")),
                    "filename": doc.get("filename", "resume"),
                    "resume_name": doc.get("filename", "resume"),
                    "job_title": "Software Engineer",
                    "ats_score": doc.get("ats_score", 0),
                    "keyword_match": doc.get("keyword_match", 0),
                    "missing_keywords": doc.get("missing_keywords", []),
                    "date": doc.get("created_at", ""),
                    "created_at": doc.get("created_at", ""),
                    "analysis_result": doc.get("analysis_result", {}),
                })
            return results
    except Exception as exc:
        logger.error(f"Failed to fetch history from Supabase: {exc}")
        return []

async def delete_analysis(analysis_id: str, user_id: str) -> bool:
    headers = _get_headers()
    if not headers:
        try:
            conn = _get_sqlite_conn()
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM analyses WHERE id = ? AND user_id = ?",
                (analysis_id, user_id)
            )
            rows_affected = cursor.rowcount
            conn.commit()
            conn.close()
            return rows_affected > 0
        except Exception as exc:
            logger.error(f"Failed to delete analysis {analysis_id} from local SQLite: {exc}")
            return False

    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/analyses"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                url, 
                headers=headers, 
                params={
                    "id": f"eq.{analysis_id}",
                    "user_id": f"eq.{user_id}"
                }
            )
            response.raise_for_status()
            return True
    except Exception as exc:
        logger.error(f"Failed to delete analysis {analysis_id}: {exc}")
        return False