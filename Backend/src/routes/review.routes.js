const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');

// Public
router.get('/hotel/:hotelId', reviewController.getHotelReviews);
router.get('/tour/:tourId',   reviewController.getTourReviews);
router.get('/guide/:guideId', reviewController.getGuideReviews);

// Customer – must have completed booking
router.post('/',
  authenticate,
  uploadImages(null, 'images', 5),
  reviewController.create
);

// Owner/Guide reply
router.patch('/:id/reply',
  authenticate, authorize('hotel_owner', 'guide', 'admin'),
  reviewController.reply
);

// Mark helpful (any logged-in user)
router.patch('/:id/helpful', authenticate, reviewController.markHelpful);

// Admin moderation
router.delete('/:id', authenticate, authorize('admin'), reviewController.remove);

module.exports = router;
