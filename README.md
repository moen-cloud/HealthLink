#  HealthLink - Digital E-Clinic & Triage System

> A comprehensive MERN stack application supporting UN SDG 3: Good Health and Well-being

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Node-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)

HealthLink is a modern web application that provides accessible healthcare services including online triage, appointment scheduling, and health education for underserved communities.

![HealthLink Banner](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop)

##  Features

###  For Patients
- ** Symptom Checker** - AI-powered triage system with risk assessment
- ** Appointment Booking** - Easy scheduling with healthcare providers
- ** Health Library** - Access to educational articles and resources
- ** Personal Dashboard** - Track appointments and health checks
- ** Medical History** - Maintain your health records

###  For Doctors
- ** Appointment Management** - Review and respond to patient requests
- ** Triage Review** - Provide professional feedback on symptom checks
- ** Content Creation** - Write and manage health education articles
- ** Dashboard Analytics** - Monitor practice statistics
- ** Patient Communication** - Respond to patient queries

###  UI/UX Highlights
- ✅ Responsive design for all devices
- ✅ Modern, polished interface
- ✅ Smooth animations and transitions
- ✅ Interactive components
- ✅ Accessibility compliant
- ✅ Fast loading times

##  Quick Start

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/healthlink.git
cd healthlink
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed    # Seed database with demo data
npm run dev     # Start backend server
```

3. **Setup Frontend** (in a new terminal)
```bash
cd client
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev     # Start frontend server
```

4. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

##  Demo Credentials

After seeding the database, use these credentials:

**Doctor Account:**
- Email: `doctor@healthlink.com`
- Password: `doctor123`

**Patient Account:**
- Email: `patient@healthlink.com`
- Password: `patient123`

## Project Structure

```
healthlink/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   ├── server.js          # Main server file
│   ├── seed.js            # Database seeder
│   └── package.json
│
└── README.md              # This file
```

##  Technology Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling (CDN)
- **Axios** - HTTP client
- **Context API** - State management
- **Vite** - Build tool

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

##  Database Models

### User
- Role-based (Patient/Doctor)
- Profile information
- Medical history

### Appointment
- Patient requests
- Doctor responses
- Status tracking

### Triage
- Symptom assessment
- Risk level calculation
- Doctor feedback

### Article
- Health education content
- Categorized articles
- View tracking

##  Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- CORS configuration
- MongoDB injection protection

##  API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # User login
GET    /api/auth/me           # Get current user
```

### Appointments
```
POST   /api/appointments              # Create appointment
GET    /api/appointments              # Get all (doctor)
GET    /api/appointments/my-appointments  # Get user's
PUT    /api/appointments/:id          # Update status
DELETE /api/appointments/:id          # Delete appointment
```

### Triage
```
POST   /api/triage                    # Submit symptom check
GET    /api/triage                    # Get all (doctor)
GET    /api/triage/my-history         # Get user's history
PUT    /api/triage/:id/respond        # Doctor response
```

### Articles
```
GET    /api/articles                  # Get all published
GET    /api/articles/:id              # Get single article
POST   /api/articles                  # Create article (doctor)
PUT    /api/articles/:id              # Update article
DELETE /api/articles/:id              # Delete article
```

##  Deployment

### Frontend (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables
4. Deploy: https://healthlink-client.onrender.com/

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables
4. Deploy: https://healthlink-hpf9.onrender.com/

### Database (MongoDB Atlas)
1. Create free cluster
2. Get connection string
3. Update `MONGODB_URI` in environment

##  Testing

### Backend Testing
```bash
cd server
npm test
```

### API Testing
Use Postman collection or:
```bash
curl http://localhost:5000/api/health
```

##  Performance Optimizations

- React.memo for expensive components
- Code splitting with lazy loading
- Image optimization
- Database indexing
- API response caching
- Minified production builds

##  Future Enhancements

- [ ] Real-time chat with Socket.io
- [ ] Video consultations
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] AI-powered diagnostics

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- UN Sustainable Development Goals
- Open source community
- Healthcare professionals who provided insights
- All contributors and testers

##  Contact

- **Email**: info@healthlink.com
- **Website**: [healthlink.com](https://healthlink.com)
- **GitHub**: [@yourusername](https://github.com/yourusername)

##  Support the Project

If you find this project helpful:
-  Star the repository
-  Report bugs
-  Suggest features
-  Contribute code
- Share with others

---

**Built with ❤️ for SDG 3: Good Health and Well-being**

*Making healthcare accessible to all.*
