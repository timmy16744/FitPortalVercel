"""
Model classes that wrap KV storage with SQLAlchemy-like interface
This provides compatibility with existing routes
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
import json
import asyncio

class BaseModel:
    """Base model class with common CRUD operations"""
    
    _model_type = None  # Override in subclasses
    _db = None  # Set when initializing
    
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    @classmethod
    async def create(cls, **kwargs) -> 'BaseModel':
        """Create a new record"""
        if not cls._db:
            from .kv_adapter import db
            cls._db = db
        
        data = await cls._db.create(cls._model_type, kwargs)
        return cls(**data)
    
    @classmethod
    async def get(cls, id: str) -> Optional['BaseModel']:
        """Get a record by ID"""
        if not cls._db:
            from .kv_adapter import db
            cls._db = db
        
        data = await cls._db.get(cls._model_type, id)
        if data:
            return cls(**data)
        return None
    
    @classmethod
    async def get_all(cls, **filters) -> List['BaseModel']:
        """Get all records with optional filters"""
        if not cls._db:
            from .kv_adapter import db
            cls._db = db
        
        records = await cls._db.get_all(cls._model_type, filters=filters if filters else None)
        return [cls(**record) for record in records]
    
    @classmethod
    async def find_one(cls, **kwargs) -> Optional['BaseModel']:
        """Find a single record matching criteria"""
        if not cls._db:
            from .kv_adapter import db
            cls._db = db
        
        data = await cls._db.find_one(cls._model_type, **kwargs)
        if data:
            return cls(**data)
        return None
    
    @classmethod
    async def find_many(cls, **kwargs) -> List['BaseModel']:
        """Find multiple records matching criteria"""
        if not cls._db:
            from .kv_adapter import db
            cls._db = db
        
        records = await cls._db.find_many(cls._model_type, **kwargs)
        return [cls(**record) for record in records]
    
    async def save(self) -> 'BaseModel':
        """Save the current instance (create or update)"""
        if not self._db:
            from .kv_adapter import db
            self._db = db
        
        data = self.to_dict()
        
        if hasattr(self, 'id') and self.id:
            # Update existing
            updated = await self._db.update(self._model_type, self.id, data)
            for key, value in updated.items():
                setattr(self, key, value)
        else:
            # Create new
            created = await self._db.create(self._model_type, data)
            for key, value in created.items():
                setattr(self, key, value)
        
        return self
    
    async def delete(self) -> bool:
        """Delete the current instance"""
        if not self._db:
            from .kv_adapter import db
            self._db = db
        
        if hasattr(self, 'id'):
            return await self._db.delete(self._model_type, self.id)
        return False
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary"""
        result = {}
        for key, value in self.__dict__.items():
            if not key.startswith('_'):
                result[key] = value
        return result
    
    def to_json(self) -> str:
        """Convert model to JSON string"""
        return json.dumps(self.to_dict(), default=str)

# Synchronous wrappers for compatibility with existing code
class SyncModelWrapper:
    """Wrapper to make async models work with sync code"""
    
    def __init__(self, async_model_class):
        self.async_model = async_model_class
    
    def create(self, **kwargs):
        """Sync wrapper for create"""
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(self.async_model.create(**kwargs))
        finally:
            loop.close()
    
    def get(self, id: str):
        """Sync wrapper for get"""
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(self.async_model.get(id))
        finally:
            loop.close()
    
    def query(self):
        """Returns a query object for chaining"""
        return SyncQuery(self.async_model)
    
    def __call__(self, **kwargs):
        """Allow instantiation like Client(name='John')"""
        return self.async_model(**kwargs)

class SyncQuery:
    """Query builder for sync compatibility"""
    
    def __init__(self, async_model):
        self.async_model = async_model
        self.filters = {}
    
    def filter_by(self, **kwargs):
        """Add filters"""
        self.filters.update(kwargs)
        return self
    
    def first(self):
        """Get first result"""
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(self.async_model.find_one(**self.filters))
        finally:
            loop.close()
    
    def all(self):
        """Get all results"""
        loop = asyncio.new_event_loop()
        try:
            return loop.run_until_complete(self.async_model.find_many(**self.filters))
        finally:
            loop.close()

# Model Classes
class AsyncClient(BaseModel):
    _model_type = 'client'

class AsyncExercise(BaseModel):
    _model_type = 'exercise'

class AsyncWorkoutTemplate(BaseModel):
    _model_type = 'workout_template'

class AsyncWorkoutLog(BaseModel):
    _model_type = 'workout_log'

class AsyncNutritionLog(BaseModel):
    _model_type = 'nutrition_log'

class AsyncMealPlan(BaseModel):
    _model_type = 'meal_plan'

class AsyncBodyStat(BaseModel):
    _model_type = 'body_stat'

class AsyncProgressPhoto(BaseModel):
    _model_type = 'progress_photo'

class AsyncMessage(BaseModel):
    _model_type = 'message'

class AsyncAchievement(BaseModel):
    _model_type = 'achievement'

class AsyncProgram(BaseModel):
    _model_type = 'program'

class AsyncGroup(BaseModel):
    _model_type = 'group'

# Export synchronous wrappers for compatibility
Client = SyncModelWrapper(AsyncClient)
Exercise = SyncModelWrapper(AsyncExercise)
WorkoutTemplate = SyncModelWrapper(AsyncWorkoutTemplate)
WorkoutLog = SyncModelWrapper(AsyncWorkoutLog)
NutritionLog = SyncModelWrapper(AsyncNutritionLog)
MealPlan = SyncModelWrapper(AsyncMealPlan)
BodyStat = SyncModelWrapper(AsyncBodyStat)
ProgressPhoto = SyncModelWrapper(AsyncProgressPhoto)
Message = SyncModelWrapper(AsyncMessage)
Achievement = SyncModelWrapper(AsyncAchievement)
Program = SyncModelWrapper(AsyncProgram)
Group = SyncModelWrapper(AsyncGroup)

# Database session mock for compatibility
class DBSession:
    """Mock database session for compatibility"""
    
    def add(self, obj):
        """Mock add - saves immediately"""
        if hasattr(obj, 'save'):
            loop = asyncio.new_event_loop()
            try:
                loop.run_until_complete(obj.save())
            finally:
                loop.close()
    
    def commit(self):
        """Mock commit - no-op since we save immediately"""
        pass
    
    def rollback(self):
        """Mock rollback - no-op"""
        pass
    
    def close(self):
        """Mock close - no-op"""
        pass

# Global db session instance
db = DBSession()

# Compatibility functions
def init_app(app):
    """Initialize with Flask app (compatibility)"""
    pass

def create_all():
    """Create all tables (compatibility)"""
    # Initialize database with seed data if needed
    from .kv_adapter import init_db
    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(init_db())
    finally:
        loop.close()