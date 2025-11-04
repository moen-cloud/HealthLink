const Triage = require('../models/Triage');
const { assessSymptoms } = require('../utils/triageLogic');

// @desc    Submit symptom check (triage)
// @route   POST /api/triage
// @access  Private (Patient)
exports.submitTriage = async (req, res) => {
  try {
    const { symptoms } = req.body;

    // Assess symptoms using triage logic
    const { riskLevel, recommendation } = assessSymptoms(symptoms);

    // Create triage record
    const triage = await Triage.create({
      userId: req.user.id,
      symptoms,
      riskLevel,
      recommendation
    });

    res.status(201).json({
      success: true,
      message: 'Symptom check completed',
      data: triage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's triage history
// @route   GET /api/triage/my-history
// @access  Private (Patient)
exports.getMyTriageHistory = async (req, res) => {
  try {
    const triages = await Triage.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('respondedBy', 'name email');

    res.status(200).json({
      success: true,
      count: triages.length,
      data: triages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all triages (for doctors)
// @route   GET /api/triage
// @access  Private (Doctor)
exports.getAllTriages = async (req, res) => {
  try {
    const { riskLevel } = req.query;
    
    const query = riskLevel ? { riskLevel } : {};
    
    const triages = await Triage.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone age gender')
      .populate('respondedBy', 'name email');

    res.status(200).json({
      success: true,
      count: triages.length,
      data: triages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Respond to triage (doctor feedback)
// @route   PUT /api/triage/:id/respond
// @access  Private (Doctor)
exports.respondToTriage = async (req, res) => {
  try {
    const { doctorResponse } = req.body;

    let triage = await Triage.findById(req.params.id);

    if (!triage) {
      return res.status(404).json({
        success: false,
        message: 'Triage record not found'
      });
    }

    triage.doctorResponse = doctorResponse;
    triage.respondedBy = req.user.id;
    triage.respondedAt = Date.now();

    await triage.save();

    res.status(200).json({
      success: true,
      message: 'Response submitted successfully',
      data: triage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single triage by ID
// @route   GET /api/triage/:id
// @access  Private
exports.getTriageById = async (req, res) => {
  try {
    const triage = await Triage.findById(req.params.id)
      .populate('userId', 'name email phone age gender')
      .populate('respondedBy', 'name email');

    if (!triage) {
      return res.status(404).json({
        success: false,
        message: 'Triage record not found'
      });
    }

    // Check authorization (user or doctor)
    if (triage.userId._id.toString() !== req.user.id && req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this triage record'
      });
    }

    res.status(200).json({
      success: true,
      data: triage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};