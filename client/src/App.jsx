import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import SymptomChecker from './pages/patient/SymptomChecker';
import Appointments from './pages/patient/Appointments';
import NewAppointment from './pages/patient/NewAppointment';
import TriageHistory from './pages/patient/TriageHistory';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ManageAppointments from './pages/doctor/ManageAppointments';
import ManageTriages from './pages/doctor/ManageTriages';
import ManageArticles from './pages/doctor/ManageArticles';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />

              {/* Patient Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/symptom-checker"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <SymptomChecker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/appointments"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/appointments/new"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <NewAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/triage-history"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <TriageHistory />
                  </ProtectedRoute>
                }
              />

              {/* Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/appointments"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <ManageAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/triages"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <ManageTriages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/articles"
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <ManageArticles />
                  </ProtectedRoute>
                }
              />

              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;