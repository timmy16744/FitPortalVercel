#!/usr/bin/env python3
"""
Script to add Alex Thompson client with PPL program to existing database
"""

import sqlite3
import json
import uuid
from datetime import datetime, date, timedelta

# Database path - use the existing one
DATABASE_PATH = 'backend/instance/database.db'

def create_alex_client():
    """Add Alex Thompson to existing database"""
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if Alex already exists
        cursor.execute("SELECT id, name FROM client WHERE email = ?", ('alex.thompson@example.com',))
        existing = cursor.fetchone()
        
        if existing:
            print(f"Client Alex Thompson already exists: ID={existing[0]}, Name={existing[1]}")
            return existing[0]
        
        # Create new client
        client_id = str(uuid.uuid4())
        
        client_data = {
            'id': client_id,
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
            }),
            'archived': False,
            'deleted': False
        }
        
        # Insert client
        placeholders = ', '.join(['?' for _ in client_data])
        columns = ', '.join(client_data.keys())
        query = f"INSERT INTO client ({columns}) VALUES ({placeholders})"
        
        cursor.execute(query, list(client_data.values()))
        
        print(f"Created client Alex Thompson (ID: {client_id})")
        
        conn.commit()
        return client_id
        
    except Exception as e:
        print(f"Error creating client: {e}")
        conn.rollback()
        return None
    finally:
        conn.close()

def create_ppl_workout_template():
    """Create the PPL workout template"""
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if template already exists
        cursor.execute("SELECT id FROM workout_template WHERE name = ?", ('6-Day Push-Pull-Legs Split',))
        existing = cursor.fetchone()
        
        if existing:
            print(f"PPL Template already exists with ID: {existing[0]}")
            return existing[0]
        
        template_id = f"wkt_{uuid.uuid4()}"
        
        # PPL Program Data
        ppl_program = [
            {
                "name": "Push Day 1 - Chest Focus",
                "exercises": [
                    {
                        "name": "Barbell Bench Press",
                        "sets": [
                            {"reps": "8-10", "weight": "80kg", "rest": "3min"},
                            {"reps": "8-10", "weight": "82.5kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "85kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "85kg", "rest": "3min"}
                        ],
                        "bodyPart": "chest",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Incline Dumbbell Press",
                        "sets": [
                            {"reps": "10-12", "weight": "32.5kg", "rest": "2.5min"},
                            {"reps": "10-12", "weight": "35kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "37.5kg", "rest": "2.5min"}
                        ],
                        "bodyPart": "chest",
                        "equipment": "dumbbell"
                    },
                    {
                        "name": "Shoulder Press",
                        "sets": [
                            {"reps": "10-12", "weight": "22.5kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "25kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "27.5kg", "rest": "2min"}
                        ],
                        "bodyPart": "shoulders",
                        "equipment": "dumbbell"
                    },
                    {
                        "name": "Weighted Dips",
                        "sets": [
                            {"reps": "12-15", "weight": "Bodyweight", "rest": "2min"},
                            {"reps": "10-12", "weight": "+10kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "+15kg", "rest": "2min"}
                        ],
                        "bodyPart": "chest",
                        "equipment": "body weight"
                    },
                    {
                        "name": "Lateral Raises",
                        "sets": [
                            {"reps": "15-20", "weight": "10kg", "rest": "1.5min"},
                            {"reps": "15-20", "weight": "12kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "14kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "shoulders",
                        "equipment": "dumbbell"
                    },
                    {
                        "name": "Tricep Pushdowns",
                        "sets": [
                            {"reps": "12-15", "weight": "40kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "45kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "50kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "upper arms",
                        "equipment": "cable"
                    }
                ]
            },
            {
                "name": "Pull Day 1 - Back Width",
                "exercises": [
                    {
                        "name": "Pull-ups (Wide Grip)",
                        "sets": [
                            {"reps": "8-12", "weight": "Bodyweight", "rest": "3min"},
                            {"reps": "6-10", "weight": "Bodyweight", "rest": "3min"},
                            {"reps": "6-8", "weight": "+5kg", "rest": "3min"},
                            {"reps": "AMRAP", "weight": "Bodyweight", "rest": "3min"}
                        ],
                        "bodyPart": "back",
                        "equipment": "body weight"
                    },
                    {
                        "name": "Lat Pulldown",
                        "sets": [
                            {"reps": "10-12", "weight": "65kg", "rest": "2.5min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "75kg", "rest": "2.5min"}
                        ],
                        "bodyPart": "back",
                        "equipment": "cable"
                    },
                    {
                        "name": "Seated Cable Row",
                        "sets": [
                            {"reps": "12-15", "weight": "60kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "80kg", "rest": "2min"}
                        ],
                        "bodyPart": "back",
                        "equipment": "cable"
                    },
                    {
                        "name": "Barbell Rows",
                        "sets": [
                            {"reps": "10-12", "weight": "60kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "70kg", "rest": "2.5min"},
                            {"reps": "6-8", "weight": "75kg", "rest": "2.5min"}
                        ],
                        "bodyPart": "back",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Face Pulls",
                        "sets": [
                            {"reps": "15-20", "weight": "25kg", "rest": "1.5min"},
                            {"reps": "15-20", "weight": "30kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "35kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "shoulders",
                        "equipment": "cable"
                    },
                    {
                        "name": "Barbell Bicep Curls",
                        "sets": [
                            {"reps": "12-15", "weight": "25kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "30kg", "rest": "1.5min"},
                            {"reps": "8-10", "weight": "32.5kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "upper arms",
                        "equipment": "barbell"
                    }
                ]
            },
            {
                "name": "Leg Day 1 - Quad Focus",
                "exercises": [
                    {
                        "name": "Barbell Back Squat",
                        "sets": [
                            {"reps": "8-10", "weight": "90kg", "rest": "3min"},
                            {"reps": "8-10", "weight": "95kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "100kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "100kg", "rest": "3min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Leg Press",
                        "sets": [
                            {"reps": "15-20", "weight": "180kg", "rest": "2.5min"},
                            {"reps": "12-15", "weight": "200kg", "rest": "2.5min"},
                            {"reps": "10-12", "weight": "220kg", "rest": "2.5min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "leverage machine"
                    },
                    {
                        "name": "Walking Lunges",
                        "sets": [
                            {"reps": "12/leg", "weight": "20kg DBs", "rest": "2min"},
                            {"reps": "10/leg", "weight": "22.5kg DBs", "rest": "2min"},
                            {"reps": "10/leg", "weight": "25kg DBs", "rest": "2min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "dumbbell"
                    },
                    {
                        "name": "Leg Extension",
                        "sets": [
                            {"reps": "15-20", "weight": "50kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "60kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "leverage machine"
                    },
                    {
                        "name": "Standing Calf Raises",
                        "sets": [
                            {"reps": "20-25", "weight": "60kg", "rest": "1.5min"},
                            {"reps": "15-20", "weight": "70kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "80kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "lower legs",
                        "equipment": "leverage machine"
                    }
                ]
            },
            {
                "name": "Push Day 2 - Shoulder Focus",
                "exercises": [
                    {
                        "name": "Overhead Press",
                        "sets": [
                            {"reps": "8-10", "weight": "50kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "55kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "57.5kg", "rest": "3min"},
                            {"reps": "5-6", "weight": "60kg", "rest": "3min"}
                        ],
                        "bodyPart": "shoulders",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Incline Barbell Press",
                        "sets": [
                            {"reps": "10-12", "weight": "65kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "70kg", "rest": "2.5min"},
                            {"reps": "6-8", "weight": "75kg", "rest": "2.5min"}
                        ],
                        "bodyPart": "chest",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Lateral Raises",
                        "sets": [
                            {"reps": "15-20", "weight": "12kg", "rest": "2min"},
                            {"reps": "12-15", "weight": "14kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "16kg", "rest": "2min"}
                        ],
                        "bodyPart": "shoulders",
                        "equipment": "dumbbell"
                    },
                    {
                        "name": "Close Grip Bench Press",
                        "sets": [
                            {"reps": "10-12", "weight": "60kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "65kg", "rest": "2.5min"},
                            {"reps": "6-8", "weight": "70kg", "rest": "2.5min"}
                        ],
                        "bodyPart": "upper arms",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Rear Delt Flyes",
                        "sets": [
                            {"reps": "15-20", "weight": "8kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "10kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "10kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "shoulders",
                        "equipment": "dumbbell"
                    },
                    {
                        "name": "Overhead Tricep Extension",
                        "sets": [
                            {"reps": "12-15", "weight": "20kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "22.5kg", "rest": "1.5min"},
                            {"reps": "8-10", "weight": "25kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "upper arms",
                        "equipment": "dumbbell"
                    }
                ]
            },
            {
                "name": "Pull Day 2 - Back Thickness",
                "exercises": [
                    {
                        "name": "Conventional Deadlift",
                        "sets": [
                            {"reps": "6-8", "weight": "120kg", "rest": "3.5min"},
                            {"reps": "5-6", "weight": "130kg", "rest": "3.5min"},
                            {"reps": "4-5", "weight": "140kg", "rest": "3.5min"},
                            {"reps": "3-4", "weight": "145kg", "rest": "3.5min"}
                        ],
                        "bodyPart": "back",
                        "equipment": "barbell"
                    },
                    {
                        "name": "T-Bar Row",
                        "sets": [
                            {"reps": "10-12", "weight": "50kg", "rest": "2.5min"},
                            {"reps": "8-10", "weight": "60kg", "rest": "2.5min"},
                            {"reps": "6-8", "weight": "70kg", "rest": "2.5min"}
                        ],
                        "bodyPart": "back",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Barbell Shrugs",
                        "sets": [
                            {"reps": "12-15", "weight": "80kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "90kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "100kg", "rest": "2min"}
                        ],
                        "bodyPart": "back",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Close Grip Lat Pulldown",
                        "sets": [
                            {"reps": "12-15", "weight": "60kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "80kg", "rest": "2min"}
                        ],
                        "bodyPart": "back",
                        "equipment": "cable"
                    },
                    {
                        "name": "Hammer Curls",
                        "sets": [
                            {"reps": "12-15", "weight": "17.5kg", "rest": "1.5min"},
                            {"reps": "10-12", "weight": "20kg", "rest": "1.5min"},
                            {"reps": "8-10", "weight": "22.5kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "upper arms",
                        "equipment": "dumbbell"
                    },
                    {
                        "name": "Preacher Curls",
                        "sets": [
                            {"reps": "10-12", "weight": "20kg", "rest": "1.5min"},
                            {"reps": "8-10", "weight": "25kg", "rest": "1.5min"},
                            {"reps": "6-8", "weight": "27.5kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "upper arms",
                        "equipment": "barbell"
                    }
                ]
            },
            {
                "name": "Leg Day 2 - Posterior Chain",
                "exercises": [
                    {
                        "name": "Romanian Deadlift",
                        "sets": [
                            {"reps": "10-12", "weight": "80kg", "rest": "3min"},
                            {"reps": "8-10", "weight": "90kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "100kg", "rest": "3min"},
                            {"reps": "6-8", "weight": "100kg", "rest": "3min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Lying Leg Curls",
                        "sets": [
                            {"reps": "15-20", "weight": "40kg", "rest": "2min"},
                            {"reps": "12-15", "weight": "50kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "60kg", "rest": "2min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "leverage machine"
                    },
                    {
                        "name": "Barbell Hip Thrusts",
                        "sets": [
                            {"reps": "15-20", "weight": "80kg", "rest": "2.5min"},
                            {"reps": "12-15", "weight": "90kg", "rest": "2.5min"},
                            {"reps": "10-12", "weight": "100kg", "rest": "2.5min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Bulgarian Split Squats",
                        "sets": [
                            {"reps": "12/leg", "weight": "17.5kg DBs", "rest": "2min"},
                            {"reps": "10/leg", "weight": "20kg DBs", "rest": "2min"},
                            {"reps": "8/leg", "weight": "22.5kg DBs", "rest": "2min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "dumbbell"
                    },
                    {
                        "name": "Stiff Leg Deadlifts",
                        "sets": [
                            {"reps": "12-15", "weight": "60kg", "rest": "2min"},
                            {"reps": "10-12", "weight": "70kg", "rest": "2min"},
                            {"reps": "8-10", "weight": "80kg", "rest": "2min"}
                        ],
                        "bodyPart": "upper legs",
                        "equipment": "barbell"
                    },
                    {
                        "name": "Seated Calf Raises",
                        "sets": [
                            {"reps": "20-25", "weight": "40kg", "rest": "1.5min"},
                            {"reps": "15-20", "weight": "50kg", "rest": "1.5min"},
                            {"reps": "12-15", "weight": "60kg", "rest": "1.5min"}
                        ],
                        "bodyPart": "lower legs",
                        "equipment": "leverage machine"
                    }
                ]
            }
        ]
        
        # Insert workout template
        cursor.execute("""
            INSERT INTO workout_template (id, name, days, created_at, updated_at, is_public)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            template_id,
            '6-Day Push-Pull-Legs Split',
            json.dumps(ppl_program),
            datetime.utcnow().isoformat(),
            datetime.utcnow().isoformat(),
            True
        ))
        
        print(f"Created PPL workout template (ID: {template_id})")
        
        conn.commit()
        return template_id
        
    except Exception as e:
        print(f"Error creating template: {e}")
        conn.rollback()
        return None
    finally:
        conn.close()

def assign_program_to_client(client_id, template_id):
    """Assign PPL program to Alex"""
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Remove existing assignments
        cursor.execute("DELETE FROM program_assignment WHERE client_id = ?", (client_id,))
        
        # Create new assignment
        assignment_id = f"pa_{uuid.uuid4()}"
        
        cursor.execute("""
            INSERT INTO program_assignment 
            (id, client_id, template_id, start_date, current_day_index, active)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            assignment_id,
            client_id,
            template_id,
            (date.today() - timedelta(days=7)).isoformat(),  # Started a week ago
            2,  # Currently on day 3
            True
        ))
        
        print(f"Assigned PPL program to Alex (Assignment ID: {assignment_id})")
        
        conn.commit()
        return assignment_id
        
    except Exception as e:
        print(f"Error assigning program: {e}")
        conn.rollback()
        return None
    finally:
        conn.close()

def add_sample_data(client_id):
    """Add nutrition logs, body stats, messages, and achievements"""
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    try:
        # Add nutrition logs
        sample_meals = [
            {"food": "Overnight oats with protein powder", "calories": 420, "protein": 32, "carbs": 45, "fat": 8},
            {"food": "Grilled chicken with rice", "calories": 520, "protein": 45, "carbs": 60, "fat": 8},
            {"food": "Greek yogurt with almonds", "calories": 180, "protein": 15, "carbs": 12, "fat": 8},
            {"food": "Salmon with quinoa", "calories": 480, "protein": 38, "carbs": 35, "fat": 18},
            {"food": "Protein shake", "calories": 120, "protein": 25, "carbs": 3, "fat": 1},
        ]
        
        for i, meal in enumerate(sample_meals):
            log_id = f"nl_{uuid.uuid4()}"
            log_date = (date.today() - timedelta(days=i)).isoformat()
            
            cursor.execute("""
                INSERT INTO nutrition_log (id, client_id, log_date, food_item, macros)
                VALUES (?, ?, ?, ?, ?)
            """, (
                log_id,
                client_id,
                log_date,
                meal["food"],
                json.dumps(meal)
            ))
        
        # Add body stats
        for i in range(5):  # 5 weeks of data
            stat_id = str(uuid.uuid4())
            stat_date = (date.today() - timedelta(days=i*7)).isoformat()
            weight = 75.0 + (0.2 * i)  # Progressive weight gain
            
            cursor.execute("""
                INSERT INTO body_stat (id, client_id, date, weight, measurements)
                VALUES (?, ?, ?, ?, ?)
            """, (
                stat_id,
                client_id,
                stat_date,
                weight,
                json.dumps({"chest": 104, "waist": 78, "arms": 40, "thighs": 60})
            ))
        
        # Add messages
        messages = [
            {"sender": "trainer", "text": "Welcome to your new PPL program Alex! How does the volume look?", "days_ago": 5},
            {"sender": "client", "text": "Looks perfect! Excited to get started with the new split.", "days_ago": 5},
            {"sender": "trainer", "text": "Great! Make sure to focus on progressive overload. Start conservative on weights.", "days_ago": 4},
            {"sender": "client", "text": "Will do! Just finished Push Day 1 - felt great!", "days_ago": 3},
            {"sender": "trainer", "text": "Excellent! How's your recovery been? Getting enough sleep?", "days_ago": 2},
            {"sender": "client", "text": "Recovery is good! 7-8 hours sleep and hitting protein targets.", "days_ago": 1}
        ]
        
        for msg in messages:
            msg_id = f"msg_{uuid.uuid4()}"
            msg_date = (datetime.now() - timedelta(days=msg["days_ago"])).isoformat()
            
            cursor.execute("""
                INSERT INTO message (id, client_id, sender_type, text, timestamp)
                VALUES (?, ?, ?, ?, ?)
            """, (
                msg_id,
                client_id,
                msg["sender"],
                msg["text"],
                msg_date
            ))
        
        # Add achievements
        achievements = [
            {"type": "milestone", "title": "First Week Complete!", "description": "Completed first week of PPL program"},
            {"type": "strength", "title": "Bench Press PR", "description": "New personal record: 85kg x 8 reps"},
            {"type": "consistency", "title": "Perfect Week", "description": "Completed all 6 scheduled workouts"},
            {"type": "nutrition", "title": "Macro Master", "description": "Hit protein targets 7 days in a row"}
        ]
        
        for i, ach in enumerate(achievements):
            ach_id = f"ach_{uuid.uuid4()}"
            ach_date = (datetime.now() - timedelta(days=i+1)).isoformat()
            
            cursor.execute("""
                INSERT INTO achievement (id, client_id, type, title, description, unlocked_at, icon)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                ach_id,
                client_id,
                ach["type"],
                ach["title"],
                ach["description"],
                ach_date,
                "TROPHY"
            ))
        
        print("Added sample nutrition logs, body stats, messages, and achievements")
        
        conn.commit()
        
    except Exception as e:
        print(f"Error adding sample data: {e}")
        conn.rollback()
    finally:
        conn.close()

def main():
    """Main execution"""
    
    print("Creating Alex Thompson with comprehensive PPL program...")
    
    # Create client
    client_id = create_alex_client()
    if not client_id:
        print("Failed to create client")
        return
    
    # Create PPL workout template
    template_id = create_ppl_workout_template()
    if not template_id:
        print("Failed to create workout template")
        return
    
    # Assign program
    assignment_id = assign_program_to_client(client_id, template_id)
    if not assignment_id:
        print("Failed to assign program")
        return
    
    # Add sample data
    add_sample_data(client_id)
    
    print(f"\nSUCCESS! Created comprehensive client:")
    print(f"   Client ID: {client_id}")
    print(f"   Template ID: {template_id}")
    print(f"   Assignment ID: {assignment_id}")
    print(f"\nAccess URLs:")
    print(f"   Trainer View: http://localhost:3000/client/{client_id}/dashboard")
    print(f"   Client Access: http://localhost:3000/client/{client_id}")
    print(f"   Mobile Dashboard: Will require PIN setup")

if __name__ == "__main__":
    main()