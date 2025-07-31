# FitPortal Client Application

A single-page web application for clients to access their personalized fitness dashboard, workout logs, nutrition tracking, and progress monitoring.

## Features

- **PIN Code Authentication**: Secure login using client ID and 4-digit PIN
- **Workout Logging**: Interactive workout tracking with set/reps/weight logging
- **Nutrition Tracking**: Daily food logging with macro tracking
- **Progress Monitoring**: Body measurements, personal records, and achievements
- **Workout History**: Complete history of completed workouts
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd Portal/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build will be output to the `build` directory.

## Project Structure

```
client/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── PINLogin.js     # PIN authentication component
│   │   ├── ClientDashboard.js # Main dashboard component
│   │   ├── WorkoutLogger.js   # Workout tracking component
│   │   ├── NutritionTracker.js # Nutrition tracking component
│   │   └── ProgressTracker.js  # Progress monitoring component
│   ├── utils/              # Utility functions
│   │   └── api.js          # API client
│   ├── App.js              # Main application component
│   ├── App.css             # Global styles
│   ├── index.js            # Entry point
│   └── index.css           # Base styles
└── package.json           # Dependencies and scripts
```

## API Integration

The client application communicates with the FitPortal backend API. The base URL can be configured using the `REACT_APP_API_URL` environment variable.

## Authentication Flow

1. Client visits the application and is redirected to the PIN login page
2. Client enters their unique Client ID and 4-digit PIN
3. Upon successful authentication, client is redirected to their dashboard
4. Authentication state is persisted in localStorage
5. Client can logout at any time, which clears authentication state

## Key Components

### PINLogin
Handles client authentication with Client ID and PIN verification.

### ClientDashboard
Main dashboard component with tab navigation for different features:
- **Workout**: Today's workout logging
- **Nutrition**: Food and macro tracking
- **Progress**: Body stats, records, and achievements
- **Profile**: Client information

### WorkoutLogger
Interactive workout tracking with:
- Timer functionality
- Set/reps/weight logging
- Exercise notes
- Progress saving
- Workout completion

### NutritionTracker
Nutrition tracking with:
- Daily macro goals
- Food entry logging
- Progress visualization
- Entry management

### ProgressTracker
Progress monitoring with:
- Body measurements tracking
- Personal records display
- Achievements showcase
- Workout history

## Environment Variables

Create a `.env` file in the client directory to configure:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

The client application can be deployed to any static hosting service (Vercel, Netlify, etc.) by building the production version and serving the contents of the `build` directory.
