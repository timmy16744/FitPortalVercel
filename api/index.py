from http.server import BaseHTTPRequestHandler
import json
import sys
import os
from pathlib import Path
from urllib.parse import urlparse, parse_qs

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        try:
            if path == '/api/health':
                response = {
                    'status': 'healthy',
                    'message': 'API is working',
                    'path': path
                }
                
            elif path == '/api/debug':
                response = {
                    'message': 'Debug info',
                    'backend_path': str(backend_path),
                    'backend_exists': os.path.exists(str(backend_path)),
                    'python_path': sys.path[:3]
                }
                
            elif path == '/api/test':
                try:
                    from storage.kv_adapter import db
                    response = {
                        'status': 'success', 
                        'message': 'Storage import successful',
                        'db_type': type(db).__name__
                    }
                except Exception as e:
                    response = {
                        'status': 'error',
                        'error': str(e)
                    }
                    
            elif path == '/api/init':
                try:
                    from storage.models import Client, Exercise, WorkoutTemplate, create_all
                    
                    # Initialize database
                    create_all()
                    
                    # Get counts
                    clients = Client.query().all()
                    exercises = Exercise.query().all()
                    templates = WorkoutTemplate.query().all()
                    
                    response = {
                        'status': 'initialized',
                        'clients': len(clients),
                        'exercises': len(exercises),
                        'templates': len(templates)
                    }
                except Exception as e:
                    response = {
                        'status': 'error',
                        'error': str(e)
                    }
                    
            elif path == '/api/clients':
                try:
                    from storage.models import Client
                    clients = Client.query().all()
                    
                    client_data = []
                    for client in clients:
                        try:
                            if hasattr(client, 'to_dict'):
                                client_data.append(client.to_dict())
                            else:
                                client_data.append({
                                    'id': str(getattr(client, 'id', 'unknown')),
                                    'name': str(getattr(client, 'name', 'Unknown')),
                                    'email': str(getattr(client, 'email', ''))
                                })
                        except Exception as client_error:
                            client_data.append({
                                'id': 'error',
                                'name': f'Error: {str(client_error)}',
                                'email': ''
                            })
                    
                    response = {'clients': client_data}
                    
                except Exception as e:
                    response = {'error': str(e)}
                    
            elif path == '/api/exercises/enhanced':
                try:
                    from storage.models import Exercise
                    exercises = Exercise.query().all()
                    
                    exercise_data = []
                    for exercise in exercises:
                        try:
                            if hasattr(exercise, 'to_dict'):
                                exercise_data.append(exercise.to_dict())
                            else:
                                exercise_data.append({
                                    'id': str(getattr(exercise, 'id', 'unknown')),
                                    'name': str(getattr(exercise, 'name', 'Unknown')),
                                    'bodyPart': str(getattr(exercise, 'bodyPart', ''))
                                })
                        except Exception as ex_error:
                            exercise_data.append({
                                'id': 'error',
                                'name': f'Error: {str(ex_error)}',
                                'bodyPart': ''
                            })
                    
                    response = {
                        'exercises': exercise_data,
                        'categories': []
                    }
                    
                except Exception as e:
                    response = {'error': str(e)}
                    
            else:
                response = {
                    'error': 'Not found',
                    'path': path,
                    'available_paths': ['/api/health', '/api/debug', '/api/test', '/api/init', '/api/clients', '/api/exercises/enhanced']
                }
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            # Global error handler
            error_response = {
                'error': f'Handler error: {str(e)}',
                'type': type(e).__name__
            }
            
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode())

    def do_POST(self):
        # Handle POST requests the same way for now
        self.do_GET()