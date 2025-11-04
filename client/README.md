# HealthLink Frontend

Modern React application for the HealthLink Digital E-Clinic & Triage System.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see `/server` directory)

### Installation

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server**
```bash
npm run dev
```

Application will run on `http://localhost:5173`

##  Project Structure

```
/client
  /public
    index.html          # HTML template
  /src
    /api
      axios.js          # Axios configuration
      endpoints.js      # API endpoints
    /components
      /common
        Navbar.jsx      # Navigation bar
        Footer.jsx      # Footer component
        LoadingSpinner.jsx
        ProtectedRoute.jsx
    /context
      AuthContext.jsx   # Authentication state
    /pages
      LandingPage.jsx   # Home page
      Login.jsx         # Login page
      Register.jsx      # Registration page
      Articles.jsx      # Articles list
      ArticleDetail.jsx # Article detail view
      /patient
        PatientDashboard.jsx
        SymptomChecker.jsx
        Appointments.jsx
        NewAppointment.jsx
        TriageHistory.jsx
      /doctor
        DoctorDashboard.jsx
        ManageAppointments.jsx
        ManageTriages.jsx
        ManageArticles.jsx
    App.jsx            # Main app component
    main.jsx           # Entry point
  vite.config.js       # Vite configuration
  package.json         # Dependencies
```

##  Features

### For Patients
- ✅ **Symptom Checker** - Intelligent triage system
- ✅ **Appointment Booking** - Schedule consultations
- ✅ **Health Articles** - Educational content library
- ✅ **Dashboard** - Personal health overview
- ✅ **Triage History** - Past symptom checks

### For Doctors
- ✅ **Appointment Management** - Review and respond to requests
- ✅ **Triage Review** - Provide feedback on symptom checks
- ✅ **Content Management** - Create and manage articles
- ✅ **Dashboard** - Practice overview
- ✅ **Patient Information** - Comprehensive patient data

### UI/UX Features
- ✅ **Responsive Design** - Works on all devices
- ✅ **Modern Animations** - Smooth transitions and effects
- ✅ **Interactive Components** - Engaging user experience
- ✅ **Real-time Updates** - Live data synchronization
- ✅ **Clean Interface** - Intuitive navigation
- ✅ **Accessibility** - WCAG compliant

##  Technologies

- **React 18** - UI library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling (CDN)
- **Context API** - State management
- **Vite** - Build tool

##  Styling

Using Tailwind CSS via CDN for rapid development:
- No build configuration needed
- Utility-first CSS classes
- Responsive design utilities
- Custom animations and transitions

##  Authentication

- JWT-based authentication
- Role-based access control (Patient/Doctor)
- Protected routes
- Persistent sessions via localStorage
- Automatic token refresh

## 📱 Pages Overview

### Public Pages
- **Landing Page** - Hero section, features, stats, CTA
- **Login/Register** - Authentication forms with demo credentials
- **Articles** - Filterable health education content
- **Article Detail** - Full article view with metadata

### Patient Pages
- **Dashboard** - Stats, quick actions, recent activity
- **Symptom Checker** - Interactive symptom assessment
- **Appointments** - View and manage appointments
- **New Appointment** - Book consultation form
- **Triage History** - Past symptom check results

### Doctor Pages
- **Dashboard** - Practice overview, pending items
- **Manage Appointments** - Review and respond to requests
- **Manage Triages** - Provide feedback on symptom checks
- **Manage Articles** - Create and edit health content

## 🚢 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Configure Environment Variables**
- Add `VITE_API_URL` in Vercel dashboard

### Build for Production

```bash
npm run build
```

Output will be in `/dist` directory.

##  Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

##  Configuration

### Vite Configuration
- React plugin enabled
- Proxy configured for API calls
- Hot Module Replacement (HMR)

### API Configuration
- Base URL configurable via environment variable
- Automatic token injection
- Response interceptors for error handling
- Redirect to login on 401

##  Key Components

### AuthContext
- Manages authentication state
- Provides login/logout functions
- User role checking
- Persistent authentication

### ProtectedRoute
- Route protection wrapper
- Role-based access control
- Automatic redirects

### LoadingSpinner
- Reusable loading indicator
- Full-screen and inline variants
- Smooth animations

##  Design Features

### Animations
- Fade-in effects on page load
- Slide-in transitions
- Hover effects on cards
- Button ripple effects
- Smooth page transitions

### Color Scheme
- Primary: Purple (#667eea)
- Secondary: Blue (#764ba2)
- Success: Green
- Warning: Yellow
- Danger: Red
- Neutral: Gray scale

### Typography
- Font Family: Inter (Google Fonts)
- Headings: Bold, large
- Body: Medium weight, readable
- Gradient text effects on headings

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### API Connection Issues
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API URL in `.env`

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

##  Performance Tips

- Use React.memo for expensive components
- Implement code splitting with lazy loading
- Optimize images before upload
- Use Tailwind's purge in production
- Enable Vite's build optimizations

##  Contributing

This is an educational project. Feel free to:
- Fork and improve
- Add new features
- Fix bugs
- Improve documentation

##  License

MIT License - Free for learning and development

## Support

For issues or questions, create an issue in the repository.

---

**Built with  for SDG 3: Good Health and Well-being**

Demo Credentials:
- Doctor: doctor@healthlink.com / doctor123
- Patient: patient@healthlink.com / patient123