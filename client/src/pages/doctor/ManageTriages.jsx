import { useState, useEffect } from 'react';
import { triageAPI } from '../../api/endpoints';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageTriages = () => {
  const [triages, setTriages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTriage, setSelectedTriage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadTriages();
  }, []);

  const loadTriages = async () => {
    try {
      const res = await triageAPI.getAllTriages();
      setTriages(res.data.data);
    } catch (error) {
      console.error('Failed to load triages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!selectedTriage || !response.trim()) return;

    setActionLoading(true);
    try {
      await triageAPI.respond(selectedTriage._id, { doctorResponse: response });
      await loadTriages();
      setModalOpen(false);
      setSelectedTriage(null);
      setResponse('');
    } catch (error) {
      console.error('Failed to respond:', error);
      alert('Failed to submit response');
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (triage) => {
    setSelectedTriage(triage);
    setResponse(triage.doctorResponse || '');
    setModalOpen(true);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'low': return '✅';
      case 'medium': return '🟡';
      case 'high': return '⚠️';
      default: return '📋';
    }
  };

  const filteredTriages = triages.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'responded') return !!t.doctorResponse;
    if (filter === 'pending') return !t.doctorResponse;
    return t.riskLevel === filter;
  });

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Triages</h1>
          <p className="text-gray-600">Review patient symptom checks and provide feedback</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'responded', 'high', 'medium', 'low'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                {status === 'all' ? triages.length :
                 status === 'responded' ? triages.filter(t => t.doctorResponse).length :
                 status === 'pending' ? triages.filter(t => !t.doctorResponse).length :
                 triages.filter(t => t.riskLevel === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Triages List */}
        {filteredTriages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600">No {filter !== 'all' ? filter : ''} triages found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredTriages.map((triage) => (
              <div key={triage._id} className={`bg-white rounded-xl shadow-md p-6 card-hover ${
                triage.riskLevel === 'high' && !triage.doctorResponse ? 'ring-2 ring-red-500' : ''
              }`}>
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-3xl">{getRiskIcon(triage.riskLevel)}</span>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium border-2 ${getRiskColor(triage.riskLevel)}`}>
                        {triage.riskLevel.toUpperCase()} RISK
                      </span>
                      {triage.doctorResponse && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Responded
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">
                        {new Date(triage.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Patient Info - ✅ FIXED: Added null checks */}
                    <div className="mb-4 bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{triage.userId?.name || 'Unknown Patient'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{triage.userId?.email || 'N/A'}</span>
                        </div>
                        {triage.userId?.age && (
                          <div>
                            <span className="text-gray-600">Age:</span>
                            <span className="ml-2 font-medium">{triage.userId.age} years</span>
                          </div>
                        )}
                        {triage.userId?.gender && (
                          <div>
                            <span className="text-gray-600">Gender:</span>
                            <span className="ml-2 font-medium capitalize">{triage.userId.gender}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Reported Symptoms:</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(triage.symptoms).map(([key, value]) => {
                          if (key === 'other' && value) {
                            return (
                              <span key={key} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                Other: {value}
                              </span>
                            );
                          }
                          if (value === true) {
                            return (
                              <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>

                    {/* System Recommendation */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">System Recommendation:</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{triage.recommendation}</p>
                    </div>

                    {/* Doctor Response */}
                    {triage.doctorResponse && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Your Response:</h4>
                        <p className="text-sm text-blue-800">{triage.doctorResponse}</p>
                        {triage.respondedAt && (
                          <p className="text-xs text-blue-600 mt-2">
                            Responded on {new Date(triage.respondedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => openModal(triage)}
                      className={`flex-1 lg:flex-none px-4 py-2 rounded-lg font-medium transition-colors ${
                        triage.doctorResponse
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {triage.doctorResponse ? 'Update Response' : 'Respond'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Response Modal - ✅ FIXED: Added null checks */}
        {modalOpen && selectedTriage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Provide Medical Feedback</h2>

              {/* Triage Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getRiskIcon(selectedTriage.riskLevel)}</span>
                  <h3 className="font-semibold text-gray-900">
                    Patient: {selectedTriage.userId?.name || 'Unknown Patient'} ({selectedTriage.riskLevel.toUpperCase()} RISK)
                  </h3>
                </div>
                <p className="text-sm text-gray-700 mt-2">{selectedTriage.recommendation}</p>
              </div>

              {/* Response Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Medical Advice
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Provide your professional medical advice and recommendations..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleRespond}
                  disabled={actionLoading || !response.trim()}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Response'}
                </button>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedTriage(null);
                    setResponse('');
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

export default ManageTriages;