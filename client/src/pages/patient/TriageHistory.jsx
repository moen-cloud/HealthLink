import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { triageAPI } from '../../api/endpoints';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TriageHistory = () => {
  const [triages, setTriages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTriages();
  }, []);

  const loadTriages = async () => {
    try {
      const response = await triageAPI.getMyHistory();
      setTriages(response.data.data);
    } catch (error) {
      console.error('Failed to load triage history:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 fade-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Symptom Check History</h1>
            <p className="text-gray-600">Review your past health assessments</p>
          </div>
          <Link
            to="/patient/symptom-checker"
            className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all btn-ripple"
          >
            + New Check
          </Link>
        </div>

        {/* Triage List */}
        {triages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-4">No symptom checks yet</p>
            <Link
              to="/patient/symptom-checker"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Start Your First Check
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {triages.map((triage) => (
              <div key={triage._id} className="bg-white rounded-xl shadow-md p-6 card-hover">
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{getRiskIcon(triage.riskLevel)}</span>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium border-2 ${getRiskColor(triage.riskLevel)}`}>
                        {triage.riskLevel.toUpperCase()} RISK
                      </span>
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

                    {/* Symptoms */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Symptoms Reported:</h3>
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

                    {/* Recommendation */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Recommendation:</h3>
                      <p className="text-gray-700 text-sm whitespace-pre-line">{triage.recommendation}</p>
                    </div>

                    {/* Doctor Response */}
                    {triage.doctorResponse && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Doctor's Response:</h4>
                            <p className="text-sm text-blue-800">{triage.doctorResponse}</p>
                            {triage.respondedBy && (
                              <p className="text-xs text-blue-600 mt-2">
                                - Dr. {triage.respondedBy.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TriageHistory;