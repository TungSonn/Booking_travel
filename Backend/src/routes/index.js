const express = require('express');
const router = express.Router();

const authRoutes    = require('./auth.routes');
const hotelRoutes   = require('./hotel.routes');
const tourRoutes    = require('./tour.routes');
const guideRoutes   = require('./guide.routes');
const bookingRoutes = require('./booking.routes');
const reviewRoutes  = require('./review.routes');

// Mount all route modules
router.use('/auth',     authRoutes);
router.use('/hotels',   hotelRoutes);
router.use('/tours',    tourRoutes);
router.use('/guides',   guideRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews',  reviewRoutes);

module.exports = router;
