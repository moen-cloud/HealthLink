const express = require('express');
const { body } = require('express-validator');
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const appointmentValidation = [
  body('symptoms').trim().notEmpty().withMessage('Please describe your symptoms'),
  body('preferredDate').isISO8601().withMessage('Please provide a valid date')
];

// Patient routes
router.post('/', protect, authorize('patient'), appointmentValidation, validate, createAppointment);
router.get('/my-appointments', protect, authorize('patient'), getMyAppointments);

// Doctor routes
router.get('/', protect, authorize('doctor'), getAllAppointments);
router.put('/:id', protect, authorize('doctor'), updateAppointment);

// Both patient and doctor can delete
router.delete('/:id', protect, deleteAppointment);

module.exports = router;