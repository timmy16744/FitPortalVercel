# FitPortal - Professional Fitness Training Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftimmy16744%2FFitPortalVercel&env=TRAINER_EMAIL,TRAINER_PASSWORD&envDescription=Configure%20your%20trainer%20login%20credentials&envLink=https%3A%2F%2Fgithub.com%2Ftimmy16744%2FFitPortalVercel%23environment-variables&project-name=fitportal&repository-name=fitportal&demo-title=FitPortal%20Demo&demo-description=Professional%20fitness%20training%20platform%20with%20trainer%20and%20client%20portals&demo-url=https%3A%2F%2Ffitportal-demo.vercel.app&stores=%5B%7B"type"%3A"kv"%7D%5D)

## 🚀 One-Click Deploy

Deploy your own FitPortal instance with a single click! This platform includes:

- ✅ **Zero Configuration Required** - Works out of the box
- ✅ **Automatic Database Setup** - Uses Vercel KV storage (no external database needed)
- ✅ **Demo Data Included** - Pre-populated with sample clients and workouts
- ✅ **Free Tier Compatible** - Runs within Vercel's free limits

## 🎯 Features

### For Trainers
- **Client Management** - Track all your clients in one place
- **Workout Builder** - Create custom workout templates with rest timers and set types
- **Exercise Library** - Comprehensive exercise database with categories
- **Progress Tracking** - Monitor client body stats and achievements
- **Messaging System** - Communicate with clients directly
- **Analytics Dashboard** - View client engagement and progress

### For Clients
- **PIN-Based Access** - Simple 6-digit PIN login (no passwords)
- **Workout Tracker** - Log workouts and track progress
- **Nutrition Plans** - Access personalized meal plans
- **Progress Photos** - Upload and track visual progress
- **Achievements** - Gamified fitness journey with points
- **Mobile Optimized** - Full mobile-responsive design

## 🛠️ Setup Instructions

### Option 1: Deploy to Vercel (Recommended)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Set your environment variables:
   - `TRAINER_EMAIL`: Your trainer login email
   - `TRAINER_PASSWORD`: Your trainer login password
4. Click "Deploy" and wait 2-3 minutes
5. Your platform is ready! 🎉

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/timmy16744/FitPortalVercel.git
cd FitPortalVercel

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm start

# In another terminal, start backend (optional for local dev)
cd backend
python run.py
```

## 📝 Environment Variables

When deploying to Vercel, you'll be prompted to set these:

| Variable | Description | Default |
|----------|-------------|---------|
| `TRAINER_EMAIL` | Email for trainer login | trainer@fitportal.com |
| `TRAINER_PASSWORD` | Password for trainer login | trainer123 |

## 🔐 Default Access Credentials

### Trainer Login
- **Email**: Use the email you set in environment variables
- **Password**: Use the password you set in environment variables

### Demo Client PINs
The platform comes with 3 demo clients:
- **Alex Johnson**: PIN `123456`
- **Sarah Williams**: PIN `234567`
- **Mike Chen**: PIN `345678`

## 🏗️ Technical Architecture

### Frontend
- **React 18** with functional components
- **Custom Webpack** configuration
- **Framer Motion** animations
- **Recharts** for data visualization
- **Mobile-first responsive design**

### Backend
- **Vercel Serverless Functions**
- **Vercel KV Storage** (Redis-compatible)
- **Zero-configuration database**
- **Automatic data persistence**
- **RESTful API design**

### Storage Solution
This platform uses **Vercel KV** for data storage:
- ✅ Automatically provisioned on deployment
- ✅ No database setup required
- ✅ Persists data across deployments
- ✅ Scales automatically with usage
- ✅ Works within free tier limits (512MB storage, 150K requests/month)

## 📊 Database Schema

The platform manages the following data models:
- Clients (with profiles and settings)
- Exercises (with categories and instructions)
- Workout Templates (multi-day programs)
- Workout Logs (completed sessions)
- Body Stats (weight, body fat, measurements)
- Nutrition Plans (meal plans and logs)
- Messages (trainer-client communication)
- Achievements (gamification system)

## 🎨 Features Highlights

### Advanced Workout Builder
- Create multi-day workout programs
- Set rest timers (30s to 5:00)
- Mark sets as Warmup, Working, or Drop sets
- Add custom instructions per exercise
- Visual exercise categorization with color coding
- Drag-and-drop exercise ordering

### Client Dashboard
- Mobile-optimized interface
- Real-time progress tracking
- Interactive charts and graphs
- Achievement notifications
- Workout history and streaks

### Trainer Analytics
- Client engagement metrics
- Workout completion rates
- Progress trends
- Revenue tracking (coming soon)

## 🚦 API Endpoints

The platform provides a complete REST API:

```
POST /api/auth/trainer/login     # Trainer authentication
POST /api/auth/client/pin        # Client PIN login
GET  /api/clients                 # List all clients
POST /api/clients                 # Create new client
GET  /api/exercises/enhanced      # Get exercises with categories
POST /api/workout-templates       # Create workout template
GET  /api/clients/{id}/workout-logs  # Get client's workout history
POST /api/messages                # Send message
```

## 📱 Progressive Web App

The platform is PWA-ready with:
- Offline capability (coming soon)
- Install to home screen
- Push notifications (coming soon)
- Background sync (coming soon)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for your fitness business!

## 💡 Use Cases

Perfect for:
- Personal Trainers
- Fitness Studios
- Online Coaching
- Corporate Wellness Programs
- Gym Management Systems

## 🆘 Support

- **Documentation**: [GitHub Wiki](https://github.com/timmy16744/FitPortalVercel/wiki)
- **Issues**: [GitHub Issues](https://github.com/timmy16744/FitPortalVercel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/timmy16744/FitPortalVercel/discussions)

## 🎯 Roadmap

- [ ] Video exercise demonstrations
- [ ] Stripe payment integration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Wearable device integration
- [ ] AI-powered workout recommendations
- [ ] Social features

---

**Built with ❤️ for fitness professionals**

*Ready to transform your fitness business? Deploy now with one click!*