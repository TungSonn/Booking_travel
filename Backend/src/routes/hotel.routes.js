const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');

// Public
router.get('/',          hotelController.getAll);      // GET  /api/hotels?city=&star=&minPrice=&maxPrice=&page=
router.get('/:slug',     hotelController.getBySlug);   // GET  /api/hotels/:slug
router.get('/:id/rooms', hotelController.getRooms);    // GET  /api/hotels/:id/rooms

// Protected – hotel owner / admin
router.post('/',
  authenticate, authorize('hotel_owner', 'admin'),
  uploadImages('thumbnail', 'images', 10),
  hotelController.create
);

router.put('/:id',
  authenticate, authorize('hotel_owner', 'admin'),
  uploadImages('thumbnail', 'images', 10),
  hotelController.update
);

router.delete('/:id',
  authenticate, authorize('hotel_owner', 'admin'),
  hotelController.remove
);

// Admin only
router.patch('/:id/verify',
  authenticate, authorize('admin'),
  hotelController.verify
);

module.exports = router;
