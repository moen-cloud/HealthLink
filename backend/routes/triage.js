const express = require('express');
const router = express.Router();

const {
  submitTriage,
  getMyTriageHistory,
  getAllTriages,
  respondToTriage,
  getTriageById
} = require('../controllers/triageController');
const { protect, authorize } = require('../middleware/auth');


// Patient routes
router.post('/', protect, authorize('patient'), submitTriage);
router.get('/my-history', protect, authorize('patient'), getMyTriageHistory);

// Doctor routes
router.get('/', protect, authorize('doctor'), getAllTriages);
router.put('/:id/respond', protect, authorize('doctor'), respondToTriage);

// Both can view individual triage
router.get('/:id', protect, getTriageById);

module.exports = router;