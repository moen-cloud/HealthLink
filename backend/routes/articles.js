const express = require('express');
const { body } = require('express-validator');
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCategory
} = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const articleValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').optional().isIn(['general', 'nutrition', 'mental-health', 'fitness', 'diseases', 'prevention'])
];

// Public routes
router.get('/', getArticles);
router.get('/category/:category', getArticlesByCategory);
router.get('/:id', getArticle);

// Doctor-only routes
router.post('/', protect, authorize('doctor'), articleValidation, validate, createArticle);
router.put('/:id', protect, authorize('doctor'), updateArticle);
router.delete('/:id', protect, authorize('doctor'), deleteArticle);

module.exports = router;