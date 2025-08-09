"""
Vercel KV Storage Adapter
Provides a database-like interface using Vercel KV (Redis)
Designed for zero-configuration deployment
"""

import os
import json
import uuid
from datetime import datetime, date
from typing import Dict, List, Any, Optional, Union
import logging

logger = logging.getLogger(__name__)

try:
    from kv import KV
    HAS_KV = True
except ImportError:
    HAS_KV = False
    logger.info("Vercel KV not available, using in-memory storage for local development")

class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder for datetime objects"""
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

class InMemoryKV:
    """In-memory storage for local development"""
    def __init__(self):
        self.store = {}
    
    async def get(self, key: str) -> Optional[str]:
        return self.store.get(key)
    
    async def set(self, key: str, value: str, ex: Optional[int] = None) -> None:
        self.store[key] = value
    
    async def delete(self, key: str) -> None:
        self.store.pop(key, None)
    
    async def keys(self, pattern: str = "*") -> List[str]:
        import re
        # Convert Redis pattern to regex
        regex_pattern = pattern.replace('*', '.*').replace('?', '.')
        regex = re.compile(f"^{regex_pattern}$")
        return [k for k in self.store.keys() if regex.match(k)]
    
    async def hget(self, key: str, field: str) -> Optional[str]:
        hash_data = self.store.get(key, {})
        if isinstance(hash_data, str):
            hash_data = json.loads(hash_data)
        return hash_data.get(field)
    
    async def hset(self, key: str, field: str, value: str) -> None:
        hash_data = self.store.get(key, {})
        if isinstance(hash_data, str):
            hash_data = json.loads(hash_data)
        hash_data[field] = value
        self.store[key] = json.dumps(hash_data)
    
    async def hgetall(self, key: str) -> Dict[str, str]:
        hash_data = self.store.get(key, {})
        if isinstance(hash_data, str):
            hash_data = json.loads(hash_data)
        return hash_data
    
    async def exists(self, key: str) -> bool:
        return key in self.store

class KVAdapter:
    """
    Adapter for Vercel KV storage that mimics database operations
    """
    
    def __init__(self):
        if HAS_KV and os.getenv('KV_URL'):
            self.kv = KV(
                url=os.getenv('KV_URL'),
                token=os.getenv('KV_REST_API_TOKEN')
            )
        else:
            self.kv = InMemoryKV()
        
        # Model prefixes for organization
        self.prefixes = {
            'client': 'client:',
            'exercise': 'exercise:',
            'workout_template': 'workout:',
            'workout_log': 'log:',
            'nutrition_log': 'nutrition:',
            'meal_plan': 'meal:',
            'body_stat': 'stat:',
            'progress_photo': 'photo:',
            'message': 'message:',
            'achievement': 'achievement:',
            'program': 'program:',
            'group': 'group:'
        }
    
    def generate_id(self) -> str:
        """Generate a unique ID"""
        return str(uuid.uuid4())
    
    async def create(self, model_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record"""
        if 'id' not in data:
            data['id'] = self.generate_id()
        
        if 'created_at' not in data:
            data['created_at'] = datetime.utcnow().isoformat()
        
        key = f"{self.prefixes.get(model_type, model_type + ':')}{data['id']}"
        
        # Store as JSON string
        await self.kv.set(key, json.dumps(data, cls=JSONEncoder))
        
        # Add to index for listing
        index_key = f"index:{model_type}"
        index = await self.kv.get(index_key)
        if index:
            index_list = json.loads(index)
        else:
            index_list = []
        
        if data['id'] not in index_list:
            index_list.append(data['id'])
            await self.kv.set(index_key, json.dumps(index_list))
        
        return data
    
    async def get(self, model_type: str, id: str) -> Optional[Dict[str, Any]]:
        """Get a single record by ID"""
        key = f"{self.prefixes.get(model_type, model_type + ':')}{id}"
        result = await self.kv.get(key)
        
        if result:
            return json.loads(result)
        return None
    
    async def get_all(self, model_type: str, filters: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Get all records of a type with optional filtering"""
        index_key = f"index:{model_type}"
        index = await self.kv.get(index_key)
        
        if not index:
            return []
        
        ids = json.loads(index)
        results = []
        
        for id in ids:
            record = await self.get(model_type, id)
            if record:
                # Apply filters if provided
                if filters:
                    match = True
                    for key, value in filters.items():
                        if record.get(key) != value:
                            match = False
                            break
                    if match:
                        results.append(record)
                else:
                    results.append(record)
        
        return results
    
    async def update(self, model_type: str, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing record"""
        existing = await self.get(model_type, id)
        
        if not existing:
            return None
        
        # Merge data
        existing.update(data)
        existing['updated_at'] = datetime.utcnow().isoformat()
        
        key = f"{self.prefixes.get(model_type, model_type + ':')}{id}"
        await self.kv.set(key, json.dumps(existing, cls=JSONEncoder))
        
        return existing
    
    async def delete(self, model_type: str, id: str) -> bool:
        """Delete a record"""
        key = f"{self.prefixes.get(model_type, model_type + ':')}{id}"
        
        # Remove from storage
        await self.kv.delete(key)
        
        # Remove from index
        index_key = f"index:{model_type}"
        index = await self.kv.get(index_key)
        
        if index:
            index_list = json.loads(index)
            if id in index_list:
                index_list.remove(id)
                await self.kv.set(index_key, json.dumps(index_list))
        
        return True
    
    async def find_one(self, model_type: str, **kwargs) -> Optional[Dict[str, Any]]:
        """Find a single record matching criteria"""
        records = await self.get_all(model_type, filters=kwargs)
        return records[0] if records else None
    
    async def find_many(self, model_type: str, **kwargs) -> List[Dict[str, Any]]:
        """Find multiple records matching criteria"""
        return await self.get_all(model_type, filters=kwargs)
    
    async def count(self, model_type: str, filters: Optional[Dict] = None) -> int:
        """Count records"""
        records = await self.get_all(model_type, filters=filters)
        return len(records)
    
    async def exists(self, model_type: str, id: str) -> bool:
        """Check if a record exists"""
        key = f"{self.prefixes.get(model_type, model_type + ':')}{id}"
        return await self.kv.exists(key)
    
    # Relationship helpers
    async def get_related(self, model_type: str, id: str, relation: str) -> List[Dict[str, Any]]:
        """Get related records (e.g., client's workouts)"""
        parent_field = f"{model_type}_id"
        return await self.find_many(relation, **{parent_field: id})
    
    async def add_relation(self, parent_type: str, parent_id: str, 
                          child_type: str, child_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a related record"""
        child_data[f"{parent_type}_id"] = parent_id
        return await self.create(child_type, child_data)

# Global instance
db = KVAdapter()

# Helper functions for compatibility
async def init_db():
    """Initialize the database with seed data if empty"""
    # Check if database is empty
    clients = await db.get_all('client')
    if not clients:
        logger.info("Database is empty, initializing with seed data...")
        from .seed_data import seed_database
        await seed_database(db)
        logger.info("Seed data loaded successfully")

async def get_db():
    """Get database instance (for dependency injection)"""
    return db