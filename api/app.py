"""
Vercel serverless function for Flask backend with KV storage
"""
import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import json
from datetime import datetime

def create_app():
    """Create and configure Flask app"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # CORS configuration
    CORS(app, origins=['http://localhost:3000', 'https://*.vercel.app'], supports_credentials=True)
    
    # Initialize SocketIO
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')
    
    # Import storage models
    from storage.models import (
        Client, Exercise, WorkoutTemplate, WorkoutLog,
        NutritionLog, MealPlan, BodyStat, ProgressPhoto,
        Message, Achievement, db, create_all
    )
    
    # Initialize database on startup
    with app.app_context():
        create_all()
    
    # Health check endpoint
    @app.route('/api/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'message': 'Backend is running with KV storage',
            'timestamp': datetime.utcnow().isoformat()
        })
    
    # Authentication endpoints
    @app.route('/api/auth/trainer/login', methods=['POST'])
    def trainer_login():
        """Trainer login endpoint"""
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Check against environment variables
        if (email == os.environ.get('TRAINER_EMAIL', 'trainer@fitportal.com') and
            password == os.environ.get('TRAINER_PASSWORD', 'trainer123')):
            return jsonify({
                'success': True,
                'token': 'trainer-token-123',
                'user': {
                    'id': 'trainer-1',
                    'email': email,
                    'name': 'Demo Trainer',
                    'role': 'trainer'
                }
            })
        
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
    @app.route('/api/auth/client/pin', methods=['POST'])
    def client_pin_login():
        """Client PIN login endpoint"""
        data = request.json
        pin = data.get('pin')
        
        # Find client by PIN
        client = Client.query().filter_by(pin=pin).first()
        
        if client:
            return jsonify({
                'success': True,
                'token': f'client-token-{client.id}',
                'user': client.to_dict() if hasattr(client, 'to_dict') else {
                    'id': client.id,
                    'name': client.name,
                    'email': client.email,
                    'role': 'client'
                }
            })
        
        return jsonify({'success': False, 'message': 'Invalid PIN'}), 401
    
    # Client endpoints
    @app.route('/api/clients', methods=['GET'])
    def get_clients():
        """Get all clients"""
        clients = Client.query().all()
        return jsonify({
            'clients': [c.to_dict() if hasattr(c, 'to_dict') else {'id': c.id, 'name': c.name} for c in clients]
        })
    
    @app.route('/api/clients', methods=['POST'])
    def create_client():
        """Create new client"""
        data = request.json
        
        # Generate PIN if not provided
        if 'pin' not in data:
            import random
            data['pin'] = str(random.randint(100000, 999999))
        
        client = Client(**data)
        client.save()
        
        return jsonify({
            'success': True,
            'client': client.to_dict() if hasattr(client, 'to_dict') else {'id': client.id, 'name': client.name}
        })
    
    @app.route('/api/clients/<client_id>', methods=['GET'])
    def get_client(client_id):
        """Get single client"""
        client = Client.get(client_id)
        
        if client:
            return jsonify({
                'client': client.to_dict() if hasattr(client, 'to_dict') else {'id': client.id, 'name': client.name}
            })
        
        return jsonify({'error': 'Client not found'}), 404
    
    # Exercise endpoints
    @app.route('/api/exercises/enhanced', methods=['GET'])
    def get_exercises_enhanced():
        """Get all exercises with categories"""
        exercises = Exercise.query().all()
        
        # Extract unique categories
        categories = list(set([e.bodyPart for e in exercises if hasattr(e, 'bodyPart') and e.bodyPart]))
        
        return jsonify({
            'exercises': [e.to_dict() if hasattr(e, 'to_dict') else {'id': e.id, 'name': e.name} for e in exercises],
            'categories': sorted(categories) if categories else []
        })
    
    @app.route('/api/exercises', methods=['POST'])
    def create_exercise():
        """Create new exercise"""
        data = request.json
        exercise = Exercise(**data)
        exercise.save()
        
        return jsonify({
            'success': True,
            'exercise': exercise.to_dict() if hasattr(exercise, 'to_dict') else {'id': exercise.id}
        })
    
    # Workout template endpoints
    @app.route('/api/workout-templates', methods=['GET'])
    def get_workout_templates():
        """Get all workout templates"""
        templates = WorkoutTemplate.query().all()
        
        return jsonify({
            'templates': [t.to_dict() if hasattr(t, 'to_dict') else {'id': t.id, 'name': t.name} for t in templates]
        })
    
    @app.route('/api/workout-templates', methods=['POST'])
    def create_workout_template():
        """Create new workout template"""
        data = request.json
        
        # Convert data to JSON string if it's a dict
        if 'data' in data and isinstance(data['data'], dict):
            data['data'] = json.dumps(data['data'])
        
        template = WorkoutTemplate(**data)
        template.save()
        
        return jsonify({
            'success': True,
            'template': template.to_dict() if hasattr(template, 'to_dict') else {'id': template.id}
        })
    
    # Workout log endpoints
    @app.route('/api/clients/<client_id>/workout-logs', methods=['GET'])
    def get_client_workout_logs(client_id):
        """Get workout logs for a client"""
        logs = WorkoutLog.query().filter_by(client_id=client_id).all()
        
        return jsonify({
            'logs': [l.to_dict() if hasattr(l, 'to_dict') else {'id': l.id} for l in logs]
        })
    
    @app.route('/api/workout-logs', methods=['POST'])
    def create_workout_log():
        """Create workout log"""
        data = request.json
        log = WorkoutLog(**data)
        log.save()
        
        return jsonify({
            'success': True,
            'log': log.to_dict() if hasattr(log, 'to_dict') else {'id': log.id}
        })
    
    # Body stats endpoints
    @app.route('/api/clients/<client_id>/body-stats', methods=['GET'])
    def get_client_body_stats(client_id):
        """Get body stats for a client"""
        stats = BodyStat.query().filter_by(client_id=client_id).all()
        
        return jsonify({
            'stats': [s.to_dict() if hasattr(s, 'to_dict') else {'id': s.id} for s in stats]
        })
    
    @app.route('/api/body-stats', methods=['POST'])
    def create_body_stat():
        """Create body stat"""
        data = request.json
        stat = BodyStat(**data)
        stat.save()
        
        return jsonify({
            'success': True,
            'stat': stat.to_dict() if hasattr(stat, 'to_dict') else {'id': stat.id}
        })
    
    # Message endpoints
    @app.route('/api/messages/<client_id>', methods=['GET'])
    def get_messages(client_id):
        """Get messages for a client"""
        messages = Message.query().filter_by(client_id=client_id).all()
        
        return jsonify({
            'messages': [m.to_dict() if hasattr(m, 'to_dict') else {'id': m.id} for m in messages]
        })
    
    @app.route('/api/messages', methods=['POST'])
    def send_message():
        """Send a message"""
        data = request.json
        message = Message(**data)
        message.save()
        
        # Emit via SocketIO if available
        if hasattr(app, 'socketio'):
            socketio.emit('new_message', message.to_dict() if hasattr(message, 'to_dict') else data)
        
        return jsonify({
            'success': True,
            'message': message.to_dict() if hasattr(message, 'to_dict') else {'id': message.id}
        })
    
    # Achievements endpoints
    @app.route('/api/achievements', methods=['GET'])
    def get_achievements():
        """Get all achievements"""
        achievements = Achievement.query().all()
        
        return jsonify({
            'achievements': [a.to_dict() if hasattr(a, 'to_dict') else {'id': a.id} for a in achievements]
        })
    
    # Meal plan endpoints
    @app.route('/api/clients/<client_id>/meal-plans', methods=['GET'])
    def get_client_meal_plans(client_id):
        """Get meal plans for a client"""
        plans = MealPlan.query().filter_by(client_id=client_id).all()
        
        return jsonify({
            'plans': [p.to_dict() if hasattr(p, 'to_dict') else {'id': p.id} for p in plans]
        })
    
    return app

# Create the Flask app
app = create_app()

# Vercel handler
def handler(request):
    """Main handler for Vercel"""
    with app.request_context(request.environ):
        try:
            response = app.full_dispatch_request()
            return response
        except Exception as e:
            return jsonify({'error': str(e)}), 500