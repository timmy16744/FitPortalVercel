"""
Vercel serverless function for Flask backend
"""
import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

# Now import everything from the backend
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
import json

# Import backend modules
try:
    from routes import register_routes
    from models import db
    import os
    
    def create_app():
        app = Flask(__name__)
        
        # Configuration
        app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
        
        # Database configuration for Vercel
        database_url = os.environ.get('DATABASE_URL')
        if database_url:
            # Use PostgreSQL in production
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        else:
            # Use SQLite for local development
            app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
        
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # Initialize extensions
        CORS(app, origins=['http://localhost:3000', 'https://*.vercel.app'])
        db.init_app(app)
        
        # Register routes
        register_routes(app)
        
        # Create tables
        with app.app_context():
            db.create_all()
        
        return app
    
    # Create the Flask app
    app = create_app()
    
except ImportError as e:
    # Fallback if backend modules aren't available
    app = Flask(__name__)
    CORS(app)
    
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'message': 'Backend is running on Vercel',
            'error': str(e) if 'e' in locals() else None
        })

# Vercel handler
def handler(request):
    """Main handler for Vercel"""
    with app.request_context(request.environ):
        try:
            response = app.full_dispatch_request()
            return response
        except HTTPException as e:
            return e.get_response()
        except Exception as e:
            return jsonify({'error': str(e)}), 500