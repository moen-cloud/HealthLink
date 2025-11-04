import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { triageAPI } from '../../api/endpoints';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    difficultyBreathing: false,
    weakness: false,
    headache: false,
    bodyAches: false,
    soreThroat: false,
    nausea: false,
    diarrhea: false,
    chestPain: false,
    other: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleToggle = (symptom) => {
    setSymptoms({
      ...symptoms,
      [symptom]: !symptoms[symptom]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await triageAPI.submit({ symptoms });
      setResult(response.data.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit symptoms:', error);
      alert('Failed to process symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const symptomsList = [
    { key: 'fever', label: 'Fever'},
    { key: 'cough', label: 'Cough'},
    { key: 'difficultyBreathing', label: 'Difficulty Breathing'},
    { key: 'weakness', label: 'Weakness/Fatigue'},
    { key: 'headache', label: 'Headache'},
    { key: 'bodyAches', label: 'Body Aches'},
    { key: 'soreThroat', label: 'Sore Throat'},
    { key: 'nausea', label: 'Nausea/Vomiting'},
    { key: 'diarrhea', label: 'Diarrhea'},
    { key: 'chestPain', label: 'Chest Pain'}
  ];

  if (submitted && result) {
    const getRiskColorClass = () => {
      switch (result.riskLevel) {
        case 'low': return 'border-green-500 bg-green-50';
        case 'medium': return 'border-yellow-500 bg-yellow-50';
        case 'high': return 'border-red-500 bg-red-50';
        default: return 'border-gray-500 bg-gray-50';
      }
    };

    const getRiskIcon = () => {
      switch (result.riskLevel) {
        case 'low': return ;
        case 'medium': return ;
        case 'high': return ;
        default: return ;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 fade-in">
            {/* Result Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{getRiskIcon()}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete</h2>
              <p className="text-gray-600">Here's what we found</p>
            </div>

            {/* Risk Level Badge */}
            <div className={`border-4 rounded-xl p-6 mb-6 ${getRiskColorClass()}`}>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Risk Level</p>
                <p className="text-3xl font-bold uppercase">{result.riskLevel}</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendation:</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{result.recommendation}</p>
            </div>

            {/* Submitted Symptoms */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Symptoms:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.symptoms).map(([key, value]) => {
                  if (key === 'other' && value) {
                    return (
                      <span key={key} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Other: {value}
                      </span>
                    );
                  }
                  if (value === true) {
                    const symptomData = symptomsList.find(s => s.key === key);
                    return (
                      <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {symptomData?.icon} {symptomData?.label}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/patient/appointments/new')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all btn-ripple"
              >
                Book Appointment
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setResult(null);
                  setSymptoms({
                    fever: false,
                    cough: false,
                    difficultyBreathing: false,
                    weakness: false,
                    headache: false,
                    bodyAches: false,
                    soreThroat: false,
                    nausea: false,
                    diarrhea: false,
                    chestPain: false,
                    other: ''
                  });
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                New Check
              </button>
              <button
                onClick={() => navigate('/patient/dashboard')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Symptom Checker</h1>
            <p className="text-gray-600">Select all symptoms you're experiencing</p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This is not a medical diagnosis. For emergencies, call emergency services immediately.
                  This tool provides general guidance only.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Symptoms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {symptomsList.map((symptom) => (
                <label
                  key={symptom.key}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    symptoms[symptom.key]
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={symptoms[symptom.key]}
                    onChange={() => handleToggle(symptom.key)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-3 text-2xl">{symptom.icon}</span>
                  <span className="ml-2 text-gray-900 font-medium">{symptom.label}</span>
                </label>
              ))}
            </div>

            {/* Other Symptoms */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Symptoms (Optional)
              </label>
              <textarea
                value={symptoms.other}
                onChange={(e) => setSymptoms({ ...symptoms, other: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Describe any other symptoms you're experiencing..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !Object.values(symptoms).some(v => v === true)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all btn-ripple disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  'Get Assessment'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/patient/dashboard')}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;