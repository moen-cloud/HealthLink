HealthLink Backend API
Digital E-Clinic & Triage System built with MERN stack supporting SDG 3 (Good Health and Well-being).
🚀 Quick Start
Prerequisites

Node.js (v16 or higher)
MongoDB (local or Atlas)
npm or yarn

Installation

Clone the repository

bash cd backend

Install dependencies

bash npm install

Configure environment variables

bashcp .env.example .env
Edit .env with your settings:
envPORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/healthlink
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

Start MongoDB (if running locally)

bashmongod

Seed the database (optional)

bash npm run seed

Start the server

bash# Development mode (with nodemon)
npm run dev

# Production mode
npm start
Server will run on http://localhost:5000
Dummy Credentials
After seeding, use these credentials:
Doctor Account:

Email: doctor@healthlink.com
Password: doctor123

Patient Account:

Email: patient@healthlink.com
Password: patient123

 Project Structure
/server
  /config
    db.js                 # Database configuration
  /models
    User.js              # User model (patients & doctors)
    Appointment.js       # Appointment requests
    Triage.js           # Symptom checker records
    Article.js          # Health articles
  /controllers
    authController.js    # Authentication logic
    userController.js    # User profile management
    appointmentController.js
    triageController.js
    articleController.js
  /routes
    auth.js             # Auth routes
    users.js            # User routes
    appointments.js     # Appointment routes
    triage.js          # Triage routes
    articles.js        # Article routes
  /middleware
    auth.js            # JWT verification & role authorization
    validation.js      # Input validation
  /utils
    triageLogic.js     # Symptom assessment logic
  server.js            # Main application file
  seed.js             # Database seeder
  .env                # Environment variables
  package.json        # Dependencies
🔌 API Endpoints
Authentication
POST   /api/auth/register      Register new user
POST   /api/auth/login         Login user
GET    /api/auth/me           Get current user
Users
GET    /api/users/profile      Get user profile
PUT    /api/users/profile      Update profile
POST   /api/users/medical-history  Add medical history
Appointments
POST   /api/appointments              Create appointment (Patient)
GET    /api/appointments              Get all appointments (Doctor)
GET    /api/appointments/my-appointments  Get user's appointments (Patient)
PUT    /api/appointments/:id          Update status (Doctor)
DELETE /api/appointments/:id          Delete appointment
Triage (Symptom Checker)
POST   /api/triage                Submit symptom check (Patient)
GET    /api/triage                Get all triages (Doctor)
GET    /api/triage/my-history     Get user's history (Patient)
GET    /api/triage/:id           Get single triage
PUT    /api/triage/:id/respond   Doctor response (Doctor)
Articles
GET    /api/articles              Get all published articles
GET    /api/articles/:id          Get single article
GET    /api/articles/category/:category  Get by category
POST   /api/articles              Create article (Doctor)
PUT    /api/articles/:id          Update article (Doctor)
DELETE /api/articles/:id          Delete article (Doctor)
 Triage Logic
The system uses rule-based assessment:
High Risk:

Fever + Cough + Difficulty Breathing
Chest Pain
Severe Difficulty Breathing

Medium Risk:

Fever + (Weakness OR Headache OR Body Aches)
Multiple symptoms combination

Low Risk:

Individual mild symptoms
No significant symptoms

 Authentication

JWT-based authentication
Token expires in 7 days (configurable)
Protected routes require Authorization: Bearer <token> header
Role-based access control (patient/doctor)

 Database Models
User

name, email, password (hashed)
role: patient | doctor
phone, age, gender
medicalHistory array

Appointment

userId, symptoms, preferredDate
status: pending | approved | rejected | completed
doctorNotes, reviewedBy, reviewedAt

Triage

userId, symptoms object (boolean flags)
riskLevel: low | medium | high
recommendation (auto-generated)
doctorResponse, respondedBy

Article

title, content, thumbnail
category: general | nutrition | mental-health | fitness | diseases | prevention
author (doctor), published, views

 Technologies

Node.js & Express - Server framework
MongoDB & Mongoose - Database
JWT - Authentication
bcryptjs - Password hashing
express-validator - Input validation
cors - Cross-origin requests

 Deployment
Render (Recommended for Backend)

Create a new Web Service on Render
Connect your GitHub repository
Configure:

Build Command: npm install
Start Command: npm start


Add environment variables in Render dashboard
Deploy!

MongoDB Atlas

Create a free cluster at mongodb.com/cloud/atlas
Get connection string
Update MONGODB_URI in your environment variables

 Scripts
bashnpm start       # Start production server
npm run dev     # Start development server with nodemon
npm run seed    # Seed database with dummy data
 Testing Endpoints
Use Postman, Thunder Client, or curl:
bash# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@healthlink.com","password":"doctor123"}'
🔒 Security Features

Password hashing with bcrypt
JWT token authentication
Role-based authorization
Input validation on all endpoints
CORS configured
MongoDB injection protection via Mongoose

📈 Future Enhancements

 Email notifications
 Real-time chat with Socket.io
 File upload for medical documents
 Appointment reminders
 Video consultation integration
 Payment gateway
 Multi-language support
 SMS notifications

 Contributing
This is an educational project for SDG 3. Feel free to fork and improve!
 License
MIT License - feel free to use for learning and development.
 Support
For issues or questions, please create an issue in the repository.

Built with love for SDG 3: Good Health and Well-being