# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack fitness training portal with React frontend and Flask backend, deployed on Vercel. The app supports two user types: trainers (who manage clients) and clients (who access workouts, nutrition plans, and progress tracking).

## Development Commands

### Running the Application
```bash
# Start both frontend and backend (run in separate terminals)
cd frontend && npm start  # Frontend on http://localhost:3000
cd backend && python run.py  # Backend on http://localhost:5000

# Or from root:
npm run dev  # Frontend dev server
npm start    # Backend Flask server
```

### Build Commands
```bash
# Production build
npm run build  # Builds frontend for production

# Vercel deployment build
npm run vercel-build  # Special build for Vercel
```

### Testing
```bash
cd frontend && npm test  # Run Jest tests with React Testing Library
```

## Architecture Overview

### Frontend Architecture
- **React 18** with functional components and hooks
- **Custom Webpack** configuration (not Create React App)
- **React Router v6** for navigation
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Socket.IO client** for real-time features

Key directories:
- `frontend/src/components/auth/` - Authentication (LoginPage, SignupPage)
- `frontend/src/components/trainer/` - Trainer dashboard components
- `frontend/src/components/client/` - Client pages (PIN entry, workout, nutrition, progress)
- `frontend/src/components/common/` - Shared components (LoadingScreen, ThemeSelector, etc.)
- `frontend/src/hooks/` - Custom hooks (useTheme, useSettings, useAccessibility)
- `frontend/src/styles/` - Premium design system CSS files

### Backend Architecture
- **Flask** with SQLAlchemy ORM
- **Flask-SocketIO** for WebSocket support
- **SQLite** database with Flask-Migrate
- **Flask-CORS** for cross-origin requests

Key files:
- `backend/app.py` - Flask application factory
- `backend/routes.py` - All API endpoints and Socket.IO handlers
- `backend/models.py` - SQLAlchemy database models
- `backend/achievements_service.py` - Gamification logic
- `backend/exercisedb_service.py` - External exercise API integration

### Database Models
Main entities: Client, Exercise, WorkoutTemplate, WorkoutLog, NutritionLog, MealPlan, BodyStat, ProgressPhoto, Message, Achievement

## Key Implementation Patterns

### API Communication
Frontend uses `frontend/src/utils/api.js` for all backend calls:
```javascript
// API base URL from environment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### Authentication Flow
1. Trainer login via email/password
2. Clients access via 6-digit PIN (no password)
3. JWT tokens stored in localStorage
4. Protected routes check authentication state

### Real-time Features
Socket.IO handles:
- Live chat between trainers and clients
- Real-time notifications
- Activity status updates

### State Management
- React Context for global state (theme, user settings)
- Local component state with hooks
- No Redux or external state management

## Environment Configuration

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TRAINER_EMAIL=trainer@fitportal.com
REACT_APP_TRAINER_PASSWORD=trainer123
```

### Backend
- Uses SQLite database (auto-created in `backend/instance/`)
- Supports DATABASE_URL environment variable override
- CORS configured for frontend URL

## Common Development Tasks

### Adding New API Endpoints
1. Add route in `backend/routes.py`
2. Update models if needed in `backend/models.py`
3. Add frontend API call in `frontend/src/utils/api.js`
4. Implement UI component in appropriate directory

### Database Migrations
```bash
cd backend
flask db init  # First time only
flask db migrate -m "Description"
flask db upgrade
```

### Styling Guidelines
- Use existing premium design system CSS files
- Follow mobile-first responsive design
- Maintain consistency with existing components
- Use CSS variables for theming

## Deployment Notes

Vercel deployment configured via `vercel.json`:
- Frontend served as static files
- Backend runs as serverless function
- Environment variables must be set in Vercel dashboard
- Database persists in Vercel's filesystem