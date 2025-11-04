/**
 * Triage Logic - Rule-based symptom assessment
 * Determines risk level and provides recommendations
 */

exports.assessSymptoms = (symptoms) => {
  let riskLevel = 'low';
  let recommendation = '';

  // HIGH RISK: Severe respiratory symptoms
  if (symptoms.fever && symptoms.cough && symptoms.difficultyBreathing) {
    riskLevel = 'high';
    recommendation = '⚠️ HIGH RISK: You are experiencing severe symptoms that require immediate medical attention. Please visit the nearest emergency room or call emergency services right away. Symptoms like fever, cough, and difficulty breathing can indicate a serious respiratory condition.';
  }
  // HIGH RISK: Chest pain
  else if (symptoms.chestPain) {
    riskLevel = 'high';
    recommendation = '⚠️ HIGH RISK: Chest pain can be a sign of a serious condition. Please seek immediate medical attention or call emergency services. Do not wait or drive yourself if the pain is severe.';
  }
  // HIGH RISK: Severe difficulty breathing
  else if (symptoms.difficultyBreathing) {
    riskLevel = 'high';
    recommendation = '⚠️ HIGH RISK: Difficulty breathing requires immediate medical evaluation. Please go to the nearest emergency room or call emergency services.';
  }
  // MEDIUM RISK: Flu-like symptoms
  else if (symptoms.fever && (symptoms.weakness || symptoms.headache || symptoms.bodyAches)) {
    riskLevel = 'medium';
    recommendation = '🟡 MEDIUM RISK: Your symptoms suggest a possible flu or viral infection. We recommend scheduling an appointment with a healthcare provider within 24-48 hours. In the meantime: rest, stay hydrated, and monitor your temperature. Seek immediate care if symptoms worsen.';
  }
  // MEDIUM RISK: Multiple symptoms
  else if (
    (symptoms.fever && symptoms.cough) ||
    (symptoms.nausea && symptoms.diarrhea) ||
    (symptoms.fever && symptoms.soreThroat)
  ) {
    riskLevel = 'medium';
    recommendation = '🟡 MEDIUM RISK: You have multiple symptoms that should be evaluated by a healthcare provider. Please schedule an appointment within the next 1-2 days. Monitor your symptoms and seek immediate care if they worsen.';
  }
  // LOW RISK: Mild symptoms
  else if (
    symptoms.headache ||
    symptoms.soreThroat ||
    symptoms.cough ||
    symptoms.weakness
  ) {
    riskLevel = 'low';
    recommendation = '✅ LOW RISK: Your symptoms appear mild. We recommend rest, staying hydrated, and over-the-counter medication if needed. If symptoms persist for more than 3-5 days or worsen, please schedule an appointment. Monitor for any new or severe symptoms.';
  }
  // NO SIGNIFICANT SYMPTOMS
  else {
    riskLevel = 'low';
    recommendation = '✅ LOW RISK: Based on the information provided, no immediate medical attention appears necessary. However, if you have concerns or symptoms develop, please don\'t hesitate to contact a healthcare provider or schedule an appointment.';
  }

  return {
    riskLevel,
    recommendation
  };
};

/**
 * Get recommendation severity color
 */
exports.getRiskColor = (riskLevel) => {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'red'
  };
  return colors[riskLevel] || 'gray';
};