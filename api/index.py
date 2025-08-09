"""
Simple entry point for Vercel serverless function
"""
import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    import json
    from datetime import datetime

    # Simple Flask app for Vercel
    app = Flask(__name__)
    CORS(app, origins=['*'])

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'healthy',
            'message': 'Simple API is working',
            'timestamp': datetime.utcnow().isoformat()
        })

    @app.route('/api/debug', methods=['GET'])
    def debug():
        return jsonify({
            'message': 'API is reachable',
            'backend_path': str(backend_path),
            'path_exists': os.path.exists(str(backend_path))
        })

    # Try to import storage and initialize if possible
    @app.route('/api/init', methods=['GET'])
    def init_data():
        try:
            from storage.models import (
                Client, Exercise, WorkoutTemplate, create_all
            )
            
            # Initialize database
            create_all()
            
            # Get counts
            clients = Client.query().all()
            exercises = Exercise.query().all()
            templates = WorkoutTemplate.query().all()
            
            return jsonify({
                'status': 'initialized',
                'data_counts': {
                    'clients': len(clients),
                    'exercises': len(exercises),
                    'templates': len(templates)
                }
            })
        except Exception as e:
            return jsonify({
                'status': 'error',
                'error': str(e)
            }), 500

    # Basic client endpoint
    @app.route('/api/clients', methods=['GET'])
    def get_clients():
        try:
            from storage.models import Client
            clients = Client.query().all()
            return jsonify({
                'clients': [{'id': c.id, 'name': c.name} if hasattr(c, 'name') else {'id': c.id} for c in clients]
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Basic exercises endpoint
    @app.route('/api/exercises/enhanced', methods=['GET'])
    def get_exercises():
        try:
            from storage.models import Exercise
            exercises = Exercise.query().all()
            return jsonify({
                'exercises': [{'id': e.id, 'name': e.name} if hasattr(e, 'name') else {'id': e.id} for e in exercises],
                'categories': []
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # For Vercel
    handler = app

except Exception as e:
    # Fallback if imports fail
    from flask import Flask, jsonify
    
    app = Flask(__name__)
    
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'error',
            'message': f'Import failed: {str(e)}'
        })
    
    handler = app