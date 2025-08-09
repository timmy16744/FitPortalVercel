"""
Vercel serverless function - HTTP handler approach
"""
import json
import sys
import os
from pathlib import Path
from urllib.parse import parse_qs, urlparse

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

def handler(request, context):
    """Main Vercel serverless function handler"""
    
    try:
        # Parse the request
        method = request.get('httpMethod', 'GET')
        path = request.get('path', '/')
        
        # Simple routing
        if path == '/api/health':
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'status': 'healthy',
                    'message': 'Serverless function is working',
                    'method': method,
                    'path': path
                })
            }
        
        elif path == '/api/debug':
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'message': 'Debug info',
                    'backend_path': str(backend_path),
                    'backend_exists': os.path.exists(str(backend_path)),
                    'python_path': sys.path[:3]
                })
            }
        
        elif path == '/api/test':
            try:
                from storage.kv_adapter import db
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'status': 'success',
                        'message': 'Storage import successful',
                        'db_type': type(db).__name__
                    })
                }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'status': 'error',
                        'error': str(e)
                    })
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
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'status': 'initialized',
                        'clients': len(clients),
                        'exercises': len(exercises), 
                        'templates': len(templates)
                    })
                }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'status': 'error',
                        'error': str(e)
                    })
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
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'clients': client_data
                    })
                }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'error': str(e)
                    })
                }
        
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
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'exercises': exercise_data,
                        'categories': []
                    })
                }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'error': str(e)
                    })
                }
        
        else:
            # Default 404
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Not found',
                    'path': path,
                    'available_paths': ['/api/health', '/api/debug', '/api/test', '/api/init', '/api/clients', '/api/exercises/enhanced']
                })
            }
    
    except Exception as e:
        # Global error handler
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Function error: {str(e)}',
                'type': type(e).__name__
            })
        }