#!/usr/bin/env python3
"""
Script to create a comprehensive test client with Push-Pull-Legs program
"""

import sys
import os
import json
from datetime import date, datetime, timedelta

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Set up Flask app context
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import uuid

# Initialize Flask app with proper config
app = Flask(__name__)
db_path = os.path.join(backend_dir, 'instance', 'fitportal.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key'

# Initialize database
db = SQLAlchemy(app)

# Import models - define them inline to avoid import issues
class Client(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    unique_url = db.Column(db.String(200), unique=True, nullable=False)
    features = db.Column(db.Text, default='{}')
    points = db.Column(db.Integer, default=0)
    daily_metrics = db.Column(db.Text, default='{}')
    archived = db.Column(db.Boolean, default=False)
    deleted = db.Column(db.Boolean, default=False)
    phone = db.Column(db.String(20))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    height = db.Column(db.Float)
    weight = db.Column(db.Float)
    bodyfat = db.Column(db.Float)
    goals = db.Column(db.Text)
    medical_history = db.Column(db.Text)
    injuries = db.Column(db.Text)
    lifestyle = db.Column(db.Text)
    hours_sleep = db.Column(db.Integer)
    stress_level = db.Column(db.String(20))
    hydration_level = db.Column(db.Float)
    nutrition_habits = db.Column(db.Text)
    workout_history = db.Column(db.Text)
    workout_frequency = db.Column(db.Integer)
    workout_preference = db.Column(db.Text)
    workout_availability = db.Column(db.Text)

class WorkoutTemplate(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: f"wkt_{uuid.uuid4()}")
    name = db.Column(db.String(100), nullable=False)
    days = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_public = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "days": self.days,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "is_public": self.is_public,
        }

class ProgramAssignment(db.Model):
    __table_args__ = (db.UniqueConstraint('client_id', 'active', name='_client_active_uc'),)
    id = db.Column(db.String, primary_key=True, default=lambda: f"pa_{uuid.uuid4()}")
    client_id = db.Column(db.String, db.ForeignKey('client.id'), nullable=False)
    template_id = db.Column(db.String, db.ForeignKey('workout_template.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False, default=date.today)
    current_day_index = db.Column(db.Integer, default=0)
    active = db.Column(db.Boolean, default=True)

class NutritionLog(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: f"nl_{uuid.uuid4()}")
    client_id = db.Column(db.String, db.ForeignKey('client.id'), nullable=False)
    log_date = db.Column(db.Date, nullable=False)
    food_item = db.Column(db.String(200), nullable=False)
    macros = db.Column(db.Text, default='{}')

class BodyStat(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = db.Column(db.String, db.ForeignKey('client.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    weight = db.Column(db.Float)
    measurements = db.Column(db.Text, default='{}')

class Message(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: f"msg_{uuid.uuid4()}")
    client_id = db.Column(db.String, db.ForeignKey('client.id'), nullable=False)
    sender_type = db.Column(db.String(50), nullable=False)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Achievement(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: f"ach_{uuid.uuid4()}")
    client_id = db.Column(db.String, db.ForeignKey('client.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)
    icon = db.Column(db.String(10))

def create_comprehensive_client():
    """Create Alex Thompson - comprehensive test client"""
    
    with app.app_context():
        # Create all database tables if they don't exist
        db.create_all()
        # Check if client already exists
        existing_client = Client.query.filter_by(email='alex.thompson@example.com').first()
        if existing_client:
            print(f"Client Alex Thompson already exists with ID: {existing_client.id}")
            return existing_client.id
        
        # Create comprehensive client profile
        client_data = {
            'name': 'Alex Thompson',
            'email': 'alex.thompson@example.com',
            'unique_url': 'alex-thompson-2024',
            'phone': '+1-555-0123',
            'age': 28,
            'gender': 'Male',
            'height': 180.0,  # cm
            'weight': 75.0,   # kg
            'bodyfat': 12.0,  # %
            'goals': 'Build lean muscle mass, increase strength, maintain low body fat percentage. Target: gain 5kg muscle while staying under 15% body fat.',
            'medical_history': 'No major medical issues. Mild lower back strain from deadlifts in 2022 - fully recovered.',
            'injuries': 'Previous right shoulder impingement (2023) - resolved through physical therapy.',
            'lifestyle': 'Software engineer, sedentary job. High stress periods during project deadlines. Good sleep hygiene.',
            'hours_sleep': 7,
            'stress_level': 'Moderate',
            'hydration_level': 3.2,  # litres per day
            'nutrition_habits': 'Flexible dieting approach, tracks macros 80% of the time. Prefers meal prep. Occasional social eating on weekends.',
            'workout_history': '3 years consistent training. Started with full body routines, progressed to PPL split. Familiar with compound movements.',
            'workout_frequency': 6,  # days per week
            'workout_preference': 'Push-Pull-Legs split, compound movements, progressive overload focus',
            'workout_availability': 'Mon-Sat: 6:00-8:00 AM, flexibility on weekends for longer sessions',
            'features': json.dumps({
                'premium_features': True,
                'nutrition_tracking': True,
                'progress_photos': True,
                'chat_enabled': True,
                'custom_programs': True
            }),
            'points': 450,  # Achievement points
            'daily_metrics': json.dumps({
                'last_weigh_in': '2024-01-15',
                'last_workout': '2024-01-14',
                'streak_days': 23,
                'total_workouts': 156
            })
        }
        
        new_client = Client(**client_data)
        db.session.add(new_client)
        db.session.commit()
        
        print(f"Created client: Alex Thompson (ID: {new_client.id})")
        return new_client.id

def create_ppl_workout_template():
    """Create comprehensive 6-day Push-Pull-Legs workout template"""
    
    with app.app_context():
        # Check if template already exists
        existing_template = WorkoutTemplate.query.filter_by(name='6-Day Push-Pull-Legs Split').first()
        if existing_template:
            print(f"Template already exists with ID: {existing_template.id}")
            return existing_template.id
        
        # Define the PPL program structure
        ppl_program = [
            {
                "name": "Push Day 1 - Chest Focus",
                "exercises": [
                    {
                        "exercise_id": "0001",  # Barbell Bench Press
                        "name": "Barbell Bench Press",
                        "sets": [
                            {"reps": "8-10", "weight": "80kg", "rest": "3min"},
                            {"reps": "8-10", "weight": "82.5kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "85kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "85kg", "rest": "3min"}
                        ]
                    },
                    {
                        "exercise_id": "0267",  # Incline Dumbbell Press
                        "name": "Incline Dumbbell Press",
                        "sets": [
                            {"reps": "10-12", "weight": "32.5kg", "rest": "2.5min"},
                            {"reps": "10-12", "weight": "35kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "37.5kg", "rest": "2.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0785",  # Shoulder Press
                        "name": "Shoulder Press (Dumbbell)",
                        "sets": [
                            {"reps": "10-12", "weight": "22.5kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "25kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "27.5kg", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "1368",  # Weighted Dips
                        "name": "Weighted Dips",
                        "sets": [
                            {"reps": "12-15", "weight": "Bodyweight", "rest": "2min"},
                            {"reps": "10-12", "weight": "+10kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "+15kg", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0593",  # Lateral Raises
                        "name": "Lateral Raises",
                        "sets": [
                            {"reps": "15-20", "weight": "10kg", "rest": "1.5min"},
                            {"reps": "15-20", "weight": "12kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "14kg", "rest": "1.5min"}
                        ]
                    },
                    {
                        "exercise_id": "1162",  # Tricep Dips
                        "name": "Tricep Pushdowns",
                        "sets": [
                            {"reps": "12-15", "weight": "40kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "45kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "50kg", "rest": "1.5min"}
                        ]
                    }
                ]
            },
            {
                "name": "Pull Day 1 - Back Width",
                "exercises": [
                    {
                        "exercise_id": "0757",  # Pull-ups
                        "name": "Pull-ups (Wide Grip)",
                        "sets": [
                            {"reps": "8-12", "weight": "Bodyweight", "rest": "3min"},
                            {"reps": "6-10", "weight": "Bodyweight", "rest": "3min"},
                            {"reps": "6-8", "weight": "+5kg", "rest": "3min"},
                            {"reps": "AMRAP", "weight": "Bodyweight", "rest": "3min"}
                        ]
                    },
                    {
                        "exercise_id": "0582",  # Lat Pulldown
                        "name": "Lat Pulldown (Wide Grip)",
                        "sets": [
                            {"reps": "10-12", "weight": "65kg", "rest": "2.5min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "75kg", "rest": "2.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0757",  # Seated Cable Row
                        "name": "Seated Cable Row",
                        "sets": [
                            {"reps": "12-15", "weight": "60kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "80kg", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0142",  # Barbell Rows
                        "name": "Barbell Rows (Bent Over)",
                        "sets": [
                            {"reps": "10-12", "weight": "60kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "70kg", "rest": "2.5min"},
                            {"reps": "6-8", "weight": "75kg", "rest": "2.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0323",  # Face Pulls
                        "name": "Face Pulls",
                        "sets": [
                            {"reps": "15-20", "weight": "25kg", "rest": "1.5min"},
                            {"reps": "15-20", "weight": "30kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "35kg", "rest": "1.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0067",  # Bicep Curls
                        "name": "Barbell Bicep Curls",
                        "sets": [
                            {"reps": "12-15", "weight": "25kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "30kg", "rest": "1.5min"},
                            {"reps": "8-10", "weight": "32.5kg", "rest": "1.5min"}
                        ]
                    }
                ]
            },
            {
                "name": "Leg Day 1 - Quad Focus",
                "exercises": [
                    {
                        "exercise_id": "0126",  # Back Squat
                        "name": "Barbell Back Squat",
                        "sets": [
                            {"reps": "8-10", "weight": "90kg", "rest": "3min"},
                            {"reps": "8-10", "weight": "95kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "100kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "100kg", "rest": "3min"}
                        ]
                    },
                    {
                        "exercise_id": "0625",  # Leg Press
                        "name": "Leg Press",
                        "sets": [
                            {"reps": "15-20", "weight": "180kg", "rest": "2.5min"},
                            {"reps": "12-15", "weight": "200kg", "rest": "2.5min"},
                            {"reps": "10-12", "weight": "220kg", "rest": "2.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0685",  # Lunges
                        "name": "Walking Lunges",
                        "sets": [
                            {"reps": "12/leg", "weight": "20kg DBs", "rest": "2min"},
                            {"reps": "10/leg", "weight": "22.5kg DBs", "rest": "2min"},
                            {"reps": "10/leg", "weight": "25kg DBs", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0631",  # Leg Extension
                        "name": "Leg Extension",
                        "sets": [
                            {"reps": "15-20", "weight": "50kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "60kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "1.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0197",  # Calf Raises
                        "name": "Standing Calf Raises",
                        "sets": [
                            {"reps": "20-25", "weight": "60kg", "rest": "1.5min"},
                            {"reps": "15-20", "weight": "70kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "80kg", "rest": "1.5min"}
                        ]
                    }
                ]
            },
            {
                "name": "Push Day 2 - Shoulder Focus",
                "exercises": [
                    {
                        "exercise_id": "0715",  # Overhead Press
                        "name": "Overhead Press (Barbell)",
                        "sets": [
                            {"reps": "8-10", "weight": "50kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "55kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "57.5kg", "rest": "3min"},
                            {"reps": "5-6", "weight": "60kg", "rest": "3min"}
                        ]
                    },
                    {
                        "exercise_id": "0275",  # Incline Barbell Press
                        "name": "Incline Barbell Press",
                        "sets": [
                            {"reps": "10-12", "weight": "65kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "70kg", "rest": "2.5min"},
                            {"reps": "6-8", "weight": "75kg", "rest": "2.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0593",  # Lateral Raises
                        "name": "Lateral Raises (Dumbbell)",
                        "sets": [
                            {"reps": "15-20", "weight": "12kg", "rest": "2min"},
                            {"reps": "12-15", "weight": "14kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "16kg", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0229",  # Close Grip Bench
                        "name": "Close Grip Bench Press",
                        "sets": [
                            {"reps": "10-12", "weight": "60kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "65kg", "rest": "2.5min"},
                            {"reps": "6-8", "weight": "70kg", "rest": "2.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0758",  # Rear Delt Flyes
                        "name": "Rear Delt Flyes",
                        "sets": [
                            {"reps": "15-20", "weight": "8kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "10kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "10kg", "rest": "1.5min"}
                        ]
                    },
                    {
                        "exercise_id": "1162",  # Tricep Extension
                        "name": "Overhead Tricep Extension",
                        "sets": [
                            {"reps": "12-15", "weight": "20kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "22.5kg", "rest": "1.5min"},
                            {"reps": "8-10", "weight": "25kg", "rest": "1.5min"}
                        ]
                    }
                ]
            },
            {
                "name": "Pull Day 2 - Back Thickness",
                "exercises": [
                    {
                        "exercise_id": "0285",  # Deadlift
                        "name": "Conventional Deadlift",
                        "sets": [
                            {"reps": "6-8", "weight": "120kg", "rest": "3.5min"},
                            {"reps": "5-6", "weight": "130kg", "rest": "3.5min"},
                            {"reps": "4-5", "weight": "140kg", "rest": "3.5min"},
                            {"reps": "3-4", "weight": "145kg", "rest": "3.5min"}
                        ]
                    },
                    {
                        "exercise_id": "1173",  # T-Bar Row
                        "name": "T-Bar Row",
                        "sets": [
                            {"reps": "10-12", "weight": "50kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "60kg", "rest": "2.5min"},
                            {"reps": "6-8", "weight": "70kg", "rest": "2.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0785",  # Shrugs
                        "name": "Barbell Shrugs",
                        "sets": [
                            {"reps": "12-15", "weight": "80kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "90kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "100kg", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0582",  # Close Grip Pulldown
                        "name": "Close Grip Lat Pulldown",
                        "sets": [
                            {"reps": "12-15", "weight": "60kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "80kg", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0472",  # Hammer Curls
                        "name": "Hammer Curls",
                        "sets": [
                            {"reps": "12-15", "weight": "17.5kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "20kg", "rest": "1.5min"},
                            {"reps": "8-10", "weight": "22.5kg", "rest": "1.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0067",  # Preacher Curls
                        "name": "Preacher Curls",
                        "sets": [
                            {"reps": "10-12", "weight": "20kg", "rest": "1.5min"},
                            {"reps": "8-10", "weight": "25kg", "rest": "1.5min"},
                            {"reps": "6-8", "weight": "27.5kg", "rest": "1.5min"}
                        ]
                    }
                ]
            },
            {
                "name": "Leg Day 2 - Posterior Chain",
                "exercises": [
                    {
                        "exercise_id": "0782",  # Romanian Deadlift
                        "name": "Romanian Deadlift",
                        "sets": [
                            {"reps": "10-12", "weight": "80kg", "rest": "3min"},
                            {"reps": "8-10", "weight": "90kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "100kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "100kg", "rest": "3min"}
                        ]
                    },
                    {
                        "exercise_id": "0640",  # Leg Curls
                        "name": "Lying Leg Curls",
                        "sets": [
                            {"reps": "15-20", "weight": "40kg", "rest": "2min"},
                            {"reps": "12-15", "weight": "50kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "60kg", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0520",  # Hip Thrusts
                        "name": "Barbell Hip Thrusts",
                        "sets": [
                            {"reps": "15-20", "weight": "80kg", "rest": "2.5min"},
                            {"reps": "12-15", "weight": "90kg", "rest": "2.5min"},
                            {"reps": "10-12", "weight": "100kg", "rest": "2.5min"}
                        ]
                    },
                    {
                        "exercise_id": "0194",  # Bulgarian Split Squats
                        "name": "Bulgarian Split Squats",
                        "sets": [
                            {"reps": "12/leg", "weight": "17.5kg DBs", "rest": "2min"},
                            {"reps": "10/leg", "weight": "20kg DBs", "rest": "2min"},
                            {"reps": "8/leg", "weight": "22.5kg DBs", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0782",  # Stiff Leg Deadlifts
                        "name": "Stiff Leg Deadlifts",
                        "sets": [
                            {"reps": "12-15", "weight": "60kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "80kg", "rest": "2min"}
                        ]
                    },
                    {
                        "exercise_id": "0197",  # Seated Calf Raises
                        "name": "Seated Calf Raises",
                        "sets": [
                            {"reps": "20-25", "weight": "40kg", "rest": "1.5min"},
                            {"reps": "15-20", "weight": "50kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "60kg", "rest": "1.5min"}
                        ]
                    }
                ]
            }
        ]
        
        # Create the workout template
        template = WorkoutTemplate(
            name='6-Day Push-Pull-Legs Split',
            days=json.dumps(ppl_program),
            is_public=True
        )
        
        db.session.add(template)
        db.session.commit()
        
        print(f"Created PPL workout template (ID: {template.id})")
        return template.id

def assign_program_to_client(client_id, template_id):
    """Assign the PPL program to the client"""
    
    with app.app_context():
        # Remove any existing assignments
        existing_assignments = ProgramAssignment.query.filter_by(client_id=client_id).all()
        for assignment in existing_assignments:
            db.session.delete(assignment)
        
        # Create new assignment
        assignment = ProgramAssignment(
            client_id=client_id,
            template_id=template_id,
            start_date=date.today() - timedelta(days=7),  # Started a week ago
            current_day_index=2,  # Currently on day 3
            active=True
        )
        
        db.session.add(assignment)
        db.session.commit()
        
        print(f"Assigned PPL program to client (Assignment ID: {assignment.id})")
        return assignment.id

def add_sample_nutrition_logs(client_id):
    """Add realistic nutrition logs for the past week"""
    
    with app.app_context():
        # Sample meals for a week
        sample_meals = [
            # Day 1
            {"food": "Overnight oats with protein powder and berries", "calories": 420, "protein": 32, "carbs": 45, "fat": 8, "meal_type": "breakfast"},
            {"food": "Grilled chicken breast with rice and vegetables", "calories": 520, "protein": 45, "carbs": 60, "fat": 8, "meal_type": "lunch"},
            {"food": "Greek yogurt with almonds", "calories": 180, "protein": 15, "carbs": 12, "fat": 8, "meal_type": "snack"},
            {"food": "Salmon with quinoa and asparagus", "calories": 480, "protein": 38, "carbs": 35, "fat": 18, "meal_type": "dinner"},
            {"food": "Casein protein shake", "calories": 120, "protein": 25, "carbs": 3, "fat": 1, "meal_type": "snack"},
            
            # Day 2
            {"food": "Scrambled eggs with whole grain toast", "calories": 380, "protein": 28, "carbs": 30, "fat": 16, "meal_type": "breakfast"},
            {"food": "Turkey and avocado wrap", "calories": 450, "protein": 35, "carbs": 40, "fat": 18, "meal_type": "lunch"},
            {"food": "Apple with peanut butter", "calories": 220, "protein": 8, "carbs": 28, "fat": 16, "meal_type": "snack"},
            {"food": "Lean beef with sweet potato and broccoli", "calories": 520, "protein": 42, "carbs": 48, "fat": 12, "meal_type": "dinner"},
            {"food": "Cottage cheese", "calories": 140, "protein": 25, "carbs": 8, "fat": 2, "meal_type": "snack"},
        ]
        
        for i, meal in enumerate(sample_meals):
            log_date = date.today() - timedelta(days=i // 5)  # Spread over recent days
            
            nutrition_log = NutritionLog(
                client_id=client_id,
                log_date=log_date,
                food_item=meal["food"],
                macros=json.dumps({
                    "calories": meal["calories"],
                    "protein": meal["protein"],
                    "carbs": meal["carbs"],
                    "fat": meal["fat"],
                    "meal_type": meal["meal_type"],
                    "serving_size": "1 serving"
                })
            )
            db.session.add(nutrition_log)
        
        db.session.commit()
        print(f"Added {len(sample_meals)} nutrition log entries")

def add_body_stats(client_id):
    """Add body measurement progress over 3 months"""
    
    with app.app_context():
        # Weekly body stats for 12 weeks
        base_date = date.today() - timedelta(days=84)  # 12 weeks ago
        
        stats_data = [
            {"weight": 77.2, "measurements": {"chest": 100, "waist": 82, "arms": 38, "thighs": 58}},
            {"weight": 76.8, "measurements": {"chest": 100.5, "waist": 81.5, "arms": 38.2, "thighs": 58.3}},
            {"weight": 76.5, "measurements": {"chest": 101, "waist": 81, "arms": 38.5, "thighs": 58.5}},
            {"weight": 76.1, "measurements": {"chest": 101.5, "waist": 80.5, "arms": 38.8, "thighs": 58.8}},
            {"weight": 75.8, "measurements": {"chest": 102, "waist": 80, "arms": 39, "thighs": 59}},
            {"weight": 75.5, "measurements": {"chest": 102.5, "waist": 79.8, "arms": 39.3, "thighs": 59.2}},
            {"weight": 75.2, "measurements": {"chest": 103, "waist": 79.5, "arms": 39.5, "thighs": 59.5}},
            {"weight": 75.0, "measurements": {"chest": 103.2, "waist": 79.2, "arms": 39.8, "thighs": 59.8}},
            {"weight": 74.8, "measurements": {"chest": 103.5, "waist": 79, "arms": 40, "thighs": 60}},
            {"weight": 74.6, "measurements": {"chest": 103.8, "waist": 78.8, "arms": 40.2, "thighs": 60.2}},
            {"weight": 74.9, "measurements": {"chest": 104, "waist": 78.5, "arms": 40.5, "thighs": 60.5}},
            {"weight": 75.0, "measurements": {"chest": 104.2, "waist": 78.2, "arms": 40.8, "thighs": 60.8}}
        ]
        
        for i, stats in enumerate(stats_data):
            stat_date = base_date + timedelta(days=i*7)  # Weekly measurements
            
            body_stat = BodyStat(
                client_id=client_id,
                date=stat_date,
                weight=stats["weight"],
                measurements=json.dumps(stats["measurements"])
            )
            db.session.add(body_stat)
        
        db.session.commit()
        print(f"Added {len(stats_data)} body stat entries")

def add_messages_and_achievements(client_id):
    """Add trainer-client conversation and achievements"""
    
    with app.app_context():
        # Sample messages
        messages = [
            {"sender": "trainer", "text": "Hey Alex! Welcome to the program. I've set up your 6-day PPL split. How are you feeling about the workout structure?", "days_ago": 7},
            {"sender": "client", "text": "Thanks! I'm excited to get started. The volume looks perfect for my goals. Should I start with the suggested weights?", "days_ago": 7},
            {"sender": "trainer", "text": "Great question! Start with weights that allow you to complete the lower rep range with 2-3 reps in reserve. We can adjust based on your first week's feedback.", "days_ago": 6},
            {"sender": "client", "text": "Perfect! Just finished Push Day 1. The bench press felt strong - might be able to increase weight next week.", "days_ago": 6},
            {"sender": "trainer", "text": "Excellent! That's exactly what we want to hear. How's your recovery been? Make sure you're getting enough protein and sleep.", "days_ago": 5},
            {"sender": "client", "text": "Recovery has been good! Getting 7-8 hours sleep and hitting my protein targets. The DOMS from leg day were intense though!", "days_ago": 4},
            {"sender": "trainer", "text": "Haha that's normal! The Bulgarian split squats will get you every time. The DOMS will decrease as your body adapts. Keep up the great work!", "days_ago": 4},
            {"sender": "client", "text": "Quick question - should I increase the deadlift weight? 140kg felt pretty manageable yesterday.", "days_ago": 2},
            {"sender": "trainer", "text": "If you can hit all reps with good form and 2+ RIR, let's bump it up by 2.5-5kg next session. Your strength is progressing well!", "days_ago": 2},
            {"sender": "client", "text": "Awesome! Also wanted to mention - my weight has been stable but measurements are improving. Really happy with the body comp changes.", "days_ago": 1},
            {"sender": "trainer", "text": "That's fantastic progress! Body recomposition is exactly what we're aiming for. The scale doesn't tell the whole story - measurements and how you feel are much better indicators.", "days_ago": 1}
        ]
        
        for msg in messages:
            message_date = datetime.now() - timedelta(days=msg["days_ago"])
            
            message = Message(
                client_id=client_id,
                sender_type=msg["sender"],
                text=msg["text"],
                timestamp=message_date
            )
            db.session.add(message)
        
        # Sample achievements
        achievements = [
            {"type": "milestone", "title": "First Week Complete!", "description": "Completed your first week of the PPL program", "icon": "TARGET", "days_ago": 5},
            {"type": "strength", "title": "Bench Press PR", "description": "New personal record: 85kg x 8 reps", "icon": "MUSCLE", "days_ago": 3},
            {"type": "consistency", "title": "Perfect Week", "description": "Completed all 6 scheduled workouts this week", "icon": "FIRE", "days_ago": 2},
            {"type": "body_comp", "title": "Muscle Gain", "description": "Gained 0.8cm on arm measurements", "icon": "CHART", "days_ago": 1},
            {"type": "nutrition", "title": "Macro Master", "description": "Hit protein targets 7 days in a row", "icon": "FOOD", "days_ago": 1}
        ]
        
        for ach in achievements:
            achievement_date = datetime.now() - timedelta(days=ach["days_ago"])
            
            achievement = Achievement(
                client_id=client_id,
                type=ach["type"],
                title=ach["title"],
                description=ach["description"],
                icon=ach["icon"],
                unlocked_at=achievement_date
            )
            db.session.add(achievement)
        
        db.session.commit()
        print(f"Added {len(messages)} messages and {len(achievements)} achievements")

def main():
    """Main execution function"""
    print("Creating comprehensive test client data...")
    
    # Create client
    client_id = create_comprehensive_client()
    
    # Create PPL workout template
    template_id = create_ppl_workout_template()
    
    # Assign program to client
    assignment_id = assign_program_to_client(client_id, template_id)
    
    # Add sample data
    add_sample_nutrition_logs(client_id)
    add_body_stats(client_id)
    add_messages_and_achievements(client_id)
    
    print(f"\nSUCCESS! Created comprehensive test client:")
    print(f"   Client ID: {client_id}")
    print(f"   Template ID: {template_id}")  
    print(f"   Assignment ID: {assignment_id}")
    print(f"\nAccess URL: http://localhost:3000/client/{client_id}")
    print(f"Mobile Dashboard: http://localhost:3000/client/{client_id}/dashboard")
    
if __name__ == "__main__":
    main()