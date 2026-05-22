const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guide.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');

// Public
router.get('/',              guideController.getAll);        // GET /api/guides?area=&language=&specialty=
router.get('/:id',           guideController.getById);       // GET /api/guides/:id
router.get('/:id/calendar',  guideController.getCalendar);   // GET /api/guides/:id/calendar?month=

// Guide manages own profile (role=guide)
router.post('/profile',
  authenticate, authorize('guide'),
  uploadImages('avatar', 'gallery', 8),
  guideController.createProfile
);

router.put('/profile',
  authenticate, authorize('guide'),
  uploadImages('avatar', 'gallery', 8),
  guideController.updateProfile
);

// Admin only
router.patch('/:id/verify', authenticate, authorize('admin'), guideController.verify);
router.delete('/:id',       authenticate, authorize('admin'), guideController.remove);

module.exports = router;
