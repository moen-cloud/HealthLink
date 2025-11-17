import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../api/endpoints';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentAPI.getAllAppointments();
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    if (!selectedAppointment) return;

    setActionLoading(true);
    try {
      await appointmentAPI.update(selectedAppointment._id, {
        status,
        doctorNotes: notes
      });
      
      await loadAppointments();
      setModalOpen(false);
      setSelectedAppointment(null);
      setNotes('');
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.doctorNotes || '');
    setModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' || apt.status === filter
  );

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Appointments</h1>
          <p className="text-gray-600">Review and respond to patient appointment requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                  {appointments.filter(a => a.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600">No {filter !== 'all' ? filter : ''} appointments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-xl shadow-md p-6 card-hover">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`px-4 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Requested: {new Date(appointment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Patient Info - ✅ FIXED: Added null checks */}
                    <div className="mb-4 bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{appointment.userId?.name || 'Unknown Patient'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{appointment.userId?.email || 'N/A'}</span>
                        </div>
                        {appointment.userId?.phone && (
                          <div>
                            <span className="text-gray-600">Phone:</span>
                            <span className="ml-2 font-medium">{appointment.userId.phone}</span>
                          </div>
                        )}
                        {appointment.userId?.age && (
                          <div>
                            <span className="text-gray-600">Age:</span>
                            <span className="ml-2 font-medium">{appointment.userId.age} years</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Symptoms:</h3>
                      <p className="text-gray-700 whitespace-pre-line">{appointment.symptoms}</p>
                    </div>

                    {/* Preferred Date */}
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        Preferred Date: {new Date(appointment.preferredDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Doctor Notes */}
                    {appointment.doctorNotes && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Your Notes:</h4>
                        <p className="text-sm text-blue-800">{appointment.doctorNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {appointment.status === 'pending' && (
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => openModal(appointment)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal - ✅ FIXED: Added null checks */}
        {modalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Appointment</h2>

              {/* Patient Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Patient: {selectedAppointment.userId?.name || 'Unknown Patient'}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Preferred Date: {new Date(selectedAppointment.preferredDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">{selectedAppointment.symptoms}</p>
              </div>

              {/* Doctor Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add your notes or recommendations..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction('approved')}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleAction('rejected')}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedAppointment(null);
                    setNotes('');
                  }}
                  disabled={actionLoading}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAppointments;