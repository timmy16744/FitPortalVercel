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
    import redis
    HAS_REDIS = True
except ImportError:
    HAS_REDIS = False
    logger.info("Redis not available, using in-memory storage for local development")

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
    
    def get(self, key: str) -> Optional[str]:
        return self.store.get(key)
    
    def set(self, key: str, value: str, ex: Optional[int] = None) -> None:
        self.store[key] = value
    
    def delete(self, key: str) -> None:
        self.store.pop(key, None)
    
    def keys(self, pattern: str = "*") -> List[str]:
        import re
        # Convert Redis pattern to regex
        regex_pattern = pattern.replace('*', '.*').replace('?', '.')
        regex = re.compile(f"^{regex_pattern}$")
        return [k for k in self.store.keys() if regex.match(k)]
    
    def hget(self, key: str, field: str) -> Optional[str]:
        hash_data = self.store.get(key, {})
        if isinstance(hash_data, str):
            hash_data = json.loads(hash_data)
        return hash_data.get(field)
    
    def hset(self, key: str, field: str, value: str) -> None:
        hash_data = self.store.get(key, {})
        if isinstance(hash_data, str):
            hash_data = json.loads(hash_data)
        hash_data[field] = value
        self.store[key] = json.dumps(hash_data)
    
    def hgetall(self, key: str) -> Dict[str, str]:
        hash_data = self.store.get(key, {})
        if isinstance(hash_data, str):
            hash_data = json.loads(hash_data)
        return hash_data
    
    def exists(self, key: str) -> bool:
        return key in self.store

class KVAdapter:
    """
    Adapter for Vercel KV storage that mimics database operations
    """
    
    def __init__(self):
        # Always use in-memory storage for now to ensure it works
        # We'll add KV back once basic functionality is confirmed
        self.kv = InMemoryKV()
        logger.info("Using in-memory storage (KV will be added once basic functionality works)")
        
        # Debug info
        kv_url = os.getenv('KV_URL')
        redis_available = HAS_REDIS
        logger.info(f"Debug - KV_URL present: {'Yes' if kv_url else 'No'}, Redis available: {redis_available}")
        
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
    
    def create(self, model_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new record"""
        if 'id' not in data:
            data['id'] = self.generate_id()
        
        if 'created_at' not in data:
            data['created_at'] = datetime.utcnow().isoformat()
        
        key = f"{self.prefixes.get(model_type, model_type + ':')}{data['id']}"
        
        # Store as JSON string
        self.kv.set(key, json.dumps(data, cls=JSONEncoder))
        
        # Add to index for listing
        index_key = f"index:{model_type}"
        index = self.kv.get(index_key)
        if index:
            index_list = json.loads(index)
        else:
            index_list = []
        
        if data['id'] not in index_list:
            index_list.append(data['id'])
            self.kv.set(index_key, json.dumps(index_list))
        
        return data
    
    def get(self, model_type: str, id: str) -> Optional[Dict[str, Any]]:
        """Get a single record by ID"""
        key = f"{self.prefixes.get(model_type, model_type + ':')}{id}"
        result = self.kv.get(key)
        
        if result:
            return json.loads(result)
        return None
    
    def get_all(self, model_type: str, filters: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Get all records of a type with optional filtering"""
        index_key = f"index:{model_type}"
        index = self.kv.get(index_key)
        
        if not index:
            return []
        
        ids = json.loads(index)
        results = []
        
        for id in ids:
            record = self.get(model_type, id)
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
    
    def update(self, model_type: str, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing record"""
        existing = self.get(model_type, id)
        
        if not existing:
            return None
        
        # Merge data
        existing.update(data)
        existing['updated_at'] = datetime.utcnow().isoformat()
        
        key = f"{self.prefixes.get(model_type, model_type + ':')}{id}"
        self.kv.set(key, json.dumps(existing, cls=JSONEncoder))
        
        return existing
    
    def delete(self, model_type: str, id: str) -> bool:
        """Delete a record"""
        key = f"{self.prefixes.get(model_type, model_type + ':')}{id}"
        
        # Remove from storage
        self.kv.delete(key)
        
        # Remove from index
        index_key = f"index:{model_type}"
        index = self.kv.get(index_key)
        
        if index:
            index_list = json.loads(index)
            if id in index_list:
                index_list.remove(id)
                self.kv.set(index_key, json.dumps(index_list))
        
        return True
    
    def find_one(self, model_type: str, **kwargs) -> Optional[Dict[str, Any]]:
        """Find a single record matching criteria"""
        records = self.get_all(model_type, filters=kwargs)
        return records[0] if records else None
    
    def find_many(self, model_type: str, **kwargs) -> List[Dict[str, Any]]:
        """Find multiple records matching criteria"""
        return self.get_all(model_type, filters=kwargs)
    
    def count(self, model_type: str, filters: Optional[Dict] = None) -> int:
        """Count records"""
        records = self.get_all(model_type, filters=filters)
        return len(records)
    
    def exists(self, model_type: str, id: str) -> bool:
        """Check if a record exists"""
        key = f"{self.prefixes.get(model_type, model_type + ':')}{id}"
        if hasattr(self.kv, 'exists'):
            return bool(self.kv.exists(key))
        else:
            return self.kv.get(key) is not None
    
    # Relationship helpers
    def get_related(self, model_type: str, id: str, relation: str) -> List[Dict[str, Any]]:
        """Get related records (e.g., client's workouts)"""
        parent_field = f"{model_type}_id"
        return self.find_many(relation, **{parent_field: id})
    
    def add_relation(self, parent_type: str, parent_id: str, 
                          child_type: str, child_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a related record"""
        child_data[f"{parent_type}_id"] = parent_id
        return self.create(child_type, child_data)

# Global instance
db = KVAdapter()

# Helper functions for compatibility
def init_db():
    """Initialize the database with seed data if empty"""
    # Check if database is empty
    clients = db.get_all('client')
    if not clients:
        logger.info("Database is empty, initializing with seed data...")
        from .seed_data import seed_database_sync
        result = seed_database_sync(db)
        logger.info(f"Seed data loaded successfully: {result}")

def get_db():
    """Get database instance (for dependency injection)"""
    return db