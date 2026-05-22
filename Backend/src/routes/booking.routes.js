const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All booking routes require authentication
router.use(authenticate);

// POST /api/bookings  – create new booking (hotel | tour | guide)
router.post('/', bookingController.create);

// GET  /api/bookings  – get current user's bookings
router.get('/', bookingController.getMyBookings);

// GET  /api/bookings/:id  – booking detail
router.get('/:id', bookingController.getById);

// PATCH /api/bookings/:id/cancel  – customer cancels
router.patch('/:id/cancel', bookingController.cancel);

// PATCH /api/bookings/:id/confirm  – owner/guide confirms
router.patch('/:id/confirm', authorize('hotel_owner', 'guide', 'admin'), bookingController.confirm);

// PATCH /api/bookings/:id/complete  – mark as completed
router.patch('/:id/complete', authorize('hotel_owner', 'guide', 'admin'), bookingController.complete);

// POST /api/bookings/:id/payment  – initiate payment
router.post('/:id/payment', bookingController.initiatePayment);

// GET  /api/bookings/admin/all  – admin sees all bookings
router.get('/admin/all', authorize('admin'), bookingController.getAllAdmin);

module.exports = router;
