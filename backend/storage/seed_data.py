"""
Seed data for initial deployment
Creates demo trainer account and sample data
"""

import json
from datetime import datetime, timedelta
import random

async def seed_database(db):
    """Initialize database with demo data"""
    
    # Create demo trainer account (this would normally be a separate User model)
    # For now, we'll store trainer credentials in environment variables
    
    # Create demo clients
    demo_clients = [
        {
            "id": "demo-client-1",
            "name": "Alex Johnson",
            "email": "alex@example.com",
            "unique_url": "alex-johnson-123456",
            "pin": "123456",
            "points": 250,
            "phone": "555-0101",
            "age": 28,
            "gender": "Male",
            "height": 180,
            "weight": 75,
            "bodyfat": 15,
            "goals": "Build muscle and increase strength",
            "workout_frequency": 4,
            "workout_preference": "Weight training with some cardio",
            "archived": False,
            "deleted": False
        },
        {
            "id": "demo-client-2", 
            "name": "Sarah Williams",
            "email": "sarah@example.com",
            "unique_url": "sarah-williams-234567",
            "pin": "234567",
            "points": 180,
            "phone": "555-0102",
            "age": 32,
            "gender": "Female",
            "height": 165,
            "weight": 60,
            "bodyfat": 22,
            "goals": "Lose weight and improve cardiovascular fitness",
            "workout_frequency": 3,
            "workout_preference": "Mix of cardio and resistance training",
            "archived": False,
            "deleted": False
        },
        {
            "id": "demo-client-3",
            "name": "Mike Chen",
            "email": "mike@example.com", 
            "unique_url": "mike-chen-345678",
            "pin": "345678",
            "points": 320,
            "phone": "555-0103",
            "age": 25,
            "gender": "Male",
            "height": 175,
            "weight": 70,
            "bodyfat": 12,
            "goals": "Improve athletic performance and flexibility",
            "workout_frequency": 5,
            "workout_preference": "Functional training and sports-specific drills",
            "archived": False,
            "deleted": False
        }
    ]
    
    for client in demo_clients:
        await db.create('client', client)
    
    # Create sample exercises
    exercises = [
        # Chest
        {"id": "ex-1", "name": "Barbell Bench Press", "bodyPart": "chest", "equipment": "barbell", "target": "pectorals"},
        {"id": "ex-2", "name": "Dumbbell Flyes", "bodyPart": "chest", "equipment": "dumbbell", "target": "pectorals"},
        {"id": "ex-3", "name": "Push-ups", "bodyPart": "chest", "equipment": "body weight", "target": "pectorals"},
        
        # Back
        {"id": "ex-4", "name": "Pull-ups", "bodyPart": "back", "equipment": "body weight", "target": "lats"},
        {"id": "ex-5", "name": "Barbell Rows", "bodyPart": "back", "equipment": "barbell", "target": "middle back"},
        {"id": "ex-6", "name": "Lat Pulldown", "bodyPart": "back", "equipment": "cable", "target": "lats"},
        
        # Legs
        {"id": "ex-7", "name": "Barbell Squat", "bodyPart": "legs", "equipment": "barbell", "target": "quads"},
        {"id": "ex-8", "name": "Romanian Deadlift", "bodyPart": "legs", "equipment": "barbell", "target": "hamstrings"},
        {"id": "ex-9", "name": "Leg Press", "bodyPart": "legs", "equipment": "machine", "target": "quads"},
        
        # Shoulders
        {"id": "ex-10", "name": "Overhead Press", "bodyPart": "shoulders", "equipment": "barbell", "target": "delts"},
        {"id": "ex-11", "name": "Lateral Raises", "bodyPart": "shoulders", "equipment": "dumbbell", "target": "delts"},
        
        # Arms
        {"id": "ex-12", "name": "Barbell Curl", "bodyPart": "arms", "equipment": "barbell", "target": "biceps"},
        {"id": "ex-13", "name": "Tricep Dips", "bodyPart": "arms", "equipment": "body weight", "target": "triceps"},
        
        # Core
        {"id": "ex-14", "name": "Plank", "bodyPart": "core", "equipment": "body weight", "target": "abs"},
        {"id": "ex-15", "name": "Russian Twists", "bodyPart": "core", "equipment": "body weight", "target": "obliques"}
    ]
    
    for exercise in exercises:
        await db.create('exercise', exercise)
    
    # Create sample workout templates
    workout_templates = [
        {
            "id": "template-1",
            "name": "Upper Body Power",
            "description": "High intensity upper body workout focusing on compound movements",
            "type": "strength",
            "difficulty": "intermediate",
            "duration": 60,
            "is_public": True,
            "data": json.dumps({
                "days": [{
                    "name": "Upper Power Day",
                    "exercises": [
                        {
                            "exercise_id": "ex-1",
                            "name": "Barbell Bench Press",
                            "sets": [
                                {"set_number": 1, "reps": 12, "weight": "60kg", "set_type": "warmup", "rest_seconds": 60},
                                {"set_number": 2, "reps": 8, "weight": "80kg", "set_type": "working", "rest_seconds": 120},
                                {"set_number": 3, "reps": 6, "weight": "90kg", "set_type": "working", "rest_seconds": 180},
                                {"set_number": 4, "reps": 6, "weight": "90kg", "set_type": "working", "rest_seconds": 180}
                            ]
                        },
                        {
                            "exercise_id": "ex-5",
                            "name": "Barbell Rows",
                            "sets": [
                                {"set_number": 1, "reps": 10, "weight": "60kg", "set_type": "working", "rest_seconds": 90},
                                {"set_number": 2, "reps": 10, "weight": "60kg", "set_type": "working", "rest_seconds": 90},
                                {"set_number": 3, "reps": 10, "weight": "60kg", "set_type": "working", "rest_seconds": 90}
                            ]
                        }
                    ]
                }]
            })
        },
        {
            "id": "template-2",
            "name": "Leg Day Essentials",
            "description": "Complete lower body workout for strength and hypertrophy",
            "type": "strength",
            "difficulty": "intermediate",
            "duration": 75,
            "is_public": True,
            "data": json.dumps({
                "days": [{
                    "name": "Leg Day",
                    "exercises": [
                        {
                            "exercise_id": "ex-7",
                            "name": "Barbell Squat",
                            "sets": [
                                {"set_number": 1, "reps": 15, "weight": "bar", "set_type": "warmup", "rest_seconds": 60},
                                {"set_number": 2, "reps": 12, "weight": "60kg", "set_type": "warmup", "rest_seconds": 90},
                                {"set_number": 3, "reps": 8, "weight": "100kg", "set_type": "working", "rest_seconds": 180},
                                {"set_number": 4, "reps": 8, "weight": "100kg", "set_type": "working", "rest_seconds": 180},
                                {"set_number": 5, "reps": 12, "weight": "80kg", "set_type": "drop", "rest_seconds": 120}
                            ]
                        },
                        {
                            "exercise_id": "ex-8",
                            "name": "Romanian Deadlift",
                            "sets": [
                                {"set_number": 1, "reps": 12, "weight": "60kg", "set_type": "working", "rest_seconds": 90},
                                {"set_number": 2, "reps": 12, "weight": "60kg", "set_type": "working", "rest_seconds": 90},
                                {"set_number": 3, "reps": 12, "weight": "60kg", "set_type": "working", "rest_seconds": 90}
                            ]
                        }
                    ]
                }]
            })
        }
    ]
    
    for template in workout_templates:
        await db.create('workout_template', template)
    
    # Create sample workout logs for demo clients
    today = datetime.utcnow()
    for i in range(7):
        log_date = today - timedelta(days=i)
        
        # Alex's workout logs
        if i % 2 == 0:  # Every other day
            await db.create('workout_log', {
                "client_id": "demo-client-1",
                "template_id": "template-1" if i % 4 == 0 else "template-2",
                "completed_at": log_date.isoformat(),
                "duration": random.randint(45, 75),
                "notes": "Great workout!" if i == 0 else "Feeling strong",
                "calories_burned": random.randint(300, 500)
            })
        
        # Sarah's workout logs
        if i % 3 == 0:  # Every 3 days
            await db.create('workout_log', {
                "client_id": "demo-client-2",
                "template_id": "template-1",
                "completed_at": log_date.isoformat(),
                "duration": random.randint(40, 60),
                "notes": "Good session",
                "calories_burned": random.randint(250, 400)
            })
    
    # Create sample body stats
    for client_id in ["demo-client-1", "demo-client-2", "demo-client-3"]:
        for i in range(4):  # 4 weeks of data
            stat_date = today - timedelta(weeks=i)
            base_weight = 75 if client_id == "demo-client-1" else 60 if client_id == "demo-client-2" else 70
            
            await db.create('body_stat', {
                "client_id": client_id,
                "recorded_at": stat_date.isoformat(),
                "weight": base_weight - (i * 0.5),  # Gradual weight loss
                "body_fat": 15 + (i * 0.2) if client_id == "demo-client-1" else 22 + (i * 0.3),
                "muscle_mass": 65 - (i * 0.1) if client_id == "demo-client-1" else 45,
                "notes": f"Week {4-i} progress"
            })
    
    # Create sample achievements
    achievements = [
        {
            "id": "ach-1",
            "name": "First Workout",
            "description": "Complete your first workout",
            "icon": "🎯",
            "points": 10,
            "criteria": {"workouts_completed": 1}
        },
        {
            "id": "ach-2",
            "name": "Week Warrior",
            "description": "Complete 3 workouts in a week",
            "icon": "💪",
            "points": 25,
            "criteria": {"workouts_per_week": 3}
        },
        {
            "id": "ach-3",
            "name": "Consistency King",
            "description": "Work out for 30 days straight",
            "icon": "👑",
            "points": 100,
            "criteria": {"streak_days": 30}
        }
    ]
    
    for achievement in achievements:
        await db.create('achievement', achievement)
    
    # Create sample messages
    messages = [
        {
            "client_id": "demo-client-1",
            "sender": "trainer",
            "content": "Welcome to your fitness journey! Let's start with the Upper Body Power workout.",
            "timestamp": (today - timedelta(days=7)).isoformat()
        },
        {
            "client_id": "demo-client-1",
            "sender": "client",
            "content": "Thanks! Excited to get started. When should I do my first workout?",
            "timestamp": (today - timedelta(days=7, hours=-1)).isoformat()
        },
        {
            "client_id": "demo-client-2",
            "sender": "trainer",
            "content": "Great job on your consistency this week! Keep it up!",
            "timestamp": (today - timedelta(days=2)).isoformat()
        }
    ]
    
    for message in messages:
        await db.create('message', message)
    
    # Create sample meal plans
    meal_plans = [
        {
            "id": "meal-1",
            "client_id": "demo-client-1",
            "name": "Muscle Building Plan",
            "description": "High protein diet for muscle growth",
            "calories_target": 2800,
            "protein_target": 180,
            "carbs_target": 350,
            "fat_target": 80,
            "meals": json.dumps([
                {
                    "name": "Breakfast",
                    "foods": ["3 eggs", "2 slices whole wheat toast", "1 banana", "Greek yogurt"],
                    "calories": 550
                },
                {
                    "name": "Lunch",
                    "foods": ["Grilled chicken breast", "Brown rice", "Mixed vegetables"],
                    "calories": 650
                },
                {
                    "name": "Dinner",
                    "foods": ["Salmon fillet", "Sweet potato", "Asparagus"],
                    "calories": 600
                }
            ])
        }
    ]
    
    for plan in meal_plans:
        await db.create('meal_plan', plan)
    
    return {
        "clients": len(demo_clients),
        "exercises": len(exercises),
        "templates": len(workout_templates),
        "achievements": len(achievements)
    }