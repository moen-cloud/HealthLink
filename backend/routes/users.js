const express = require('express');
const {
  updateProfile,
  getProfile,
  addMedicalHistory
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.post('/medical-history', addMedicalHistory);

module.exports = router;