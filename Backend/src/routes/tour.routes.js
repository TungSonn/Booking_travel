const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');

// Public
router.get('/',              tourController.getAll);        // GET /api/tours?destination=&category=&minPrice=&maxPrice=&days=
router.get('/featured',      tourController.getFeatured);   // GET /api/tours/featured
router.get('/:slug',         tourController.getBySlug);     // GET /api/tours/:slug
router.get('/:id/schedules', tourController.getSchedules);  // GET /api/tours/:id/schedules

// Protected – admin only
router.post('/',
  authenticate, authorize('admin'),
  uploadImages('thumbnail', 'images', 10),
  tourController.create
);

router.put('/:id',
  authenticate, authorize('admin'),
  uploadImages('thumbnail', 'images', 10),
  tourController.update
);

router.delete('/:id', authenticate, authorize('admin'), tourController.remove);

router.patch('/:id/feature',
  authenticate, authorize('admin'),
  tourController.toggleFeatured
);

module.exports = router;
