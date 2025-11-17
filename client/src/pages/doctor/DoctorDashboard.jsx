import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, triageAPI } from '../../api/endpoints';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    totalAppointments: 0,
    highRiskTriages: 0,
    totalTriages: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [highRiskTriages, setHighRiskTriages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [appointmentsRes, triagesRes] = await Promise.all([
        appointmentAPI.getAllAppointments(),
        triageAPI.getAllTriages()
      ]);

      const appointments = appointmentsRes.data.data || [];
      const triages = triagesRes.data.data || [];

      setStats({
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        totalAppointments: appointments.length,
        highRiskTriages: triages.filter(t => t.riskLevel === 'high' && !t.doctorResponse).length,
        totalTriages: triages.length
      });

      setRecentAppointments(appointments.filter(a => a.status === 'pending').slice(0, 5));
      setHighRiskTriages(triages.filter(t => t.riskLevel === 'high' && !t.doctorResponse).slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={loadDashboardData}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, Dr. {user?.name}! 
          </h1>
          <p className="text-gray-600">Here's your practice overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Appointments</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">High Risk Cases</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.highRiskTriages}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Triages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTriages}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/doctor/appointments"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Manage Appointments</h3>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-blue-100">Review and respond to patient requests</p>
          </Link>

          <Link
            to="/doctor/triages"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Review Triages</h3>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-purple-100">Provide feedback on symptom checks</p>
          </Link>

          <Link
            to="/doctor/chat"
            className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl shadow-lg p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Patient Messages</h3>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-green-100">Chat with your patients in real-time</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Appointments - ✅ FIXED: Added null checks */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pending Appointments</h2>
              <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No pending appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-gray-900">
                        {appointment.userId?.name || 'Unknown Patient'}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(appointment.preferredDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{appointment.symptoms}</p>
                    <Link
                      to="/doctor/appointments"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Review →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* High Risk Triages - ✅ FIXED: Added null checks */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">High Risk Cases</h2>
              <Link to="/doctor/triages" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </Link>
            </div>

            {highRiskTriages.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No high risk cases pending</p>
              </div>
            ) : (
              <div className="space-y-4">
                {highRiskTriages.map((triage) => (
                  <div key={triage._id} className="border-2 border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">⚠️</span>
                        <div className="font-medium text-gray-900">
                          {triage.userId?.name || 'Unknown Patient'}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(triage.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">{triage.recommendation}</p>
                    <Link
                      to="/doctor/triages"
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Respond →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;