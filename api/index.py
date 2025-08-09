"""
Vercel serverless function wrapper for Flask app
"""
import sys
import os
from pathlib import Path

# Add backend directory to Python path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.insert(0, str(backend_path))

# Import Flask app
from app import create_app

# Create Flask app instance
app = create_app()

# This is the handler that Vercel will call
def handler(request, context):
    """Vercel serverless function handler"""
    with app.test_request_context(
        path=request.path,
        method=request.method,
        headers=request.headers,
        data=request.body
    ):
        try:
            # Get the response from Flask
            response = app.full_dispatch_request()
            
            # Return in Vercel's expected format
            return {
                'statusCode': response.status_code,
                'headers': dict(response.headers),
                'body': response.get_data(as_text=True)
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': str(e)
            }