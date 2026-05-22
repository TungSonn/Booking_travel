const { Booking, Hotel, Tour, Guide, User } = require('../models');
const { sendBookingConfirmationEmail } = require('../services/email.service');

// POST /api/bookings
exports.create = async (req, res, next) => {
  try {
    const {
      booking_type, hotel_id, tour_id, guide_id,
      start_date, end_date, adults, children,
      special_requests, contact_name, contact_email, contact_phone,
    } = req.body;

    // Calculate price based on type
    let unit_price = 0, nights = 1;
    if (booking_type === 'hotel' && hotel_id) {
      const hotel = await Hotel.findByPk(hotel_id);
      if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
      const ms = new Date(end_date) - new Date(start_date);
      nights = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
      unit_price = parseFloat(hotel.price_per_night);
    } else if (booking_type === 'tour' && tour_id) {
      const tour = await Tour.findByPk(tour_id);
      if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
      unit_price = parseFloat(tour.price_per_person);
      nights = (adults || 1) + (children || 0); // reuse as participant count
    } else if (booking_type === 'guide' && guide_id) {
      const guide = await Guide.findByPk(guide_id);
      if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
      const ms = new Date(end_date) - new Date(start_date);
      nights = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
      unit_price = parseFloat(guide.price_per_day);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid booking type or missing ID' });
    }

    const subtotal = unit_price * nights;
    const tax_amount = subtotal * 0.08; // 8% VAT
    const total_price = subtotal + tax_amount;

    const booking = await Booking.create({
      user_id: req.user.id,
      booking_type, hotel_id, tour_id, guide_id,
      start_date, end_date, adults, children,
      unit_price, subtotal, tax_amount, total_price,
      special_requests, contact_name, contact_email, contact_phone,
    });

    await sendBookingConfirmationEmail(contact_email, booking);
    res.status(201).json({ success: true, data: booking, message: 'Booking created successfully' });
  } catch (err) { next(err); }
};

// GET /api/bookings  – my bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const where = { user_id: req.user.id };
    if (status) where.status = status;
    if (type)   where.booking_type = type;
    const { count, rows } = await Booking.findAndCountAll({
      where, limit: +limit, offset: (+page - 1) * +limit,
      include: [
        { model: Hotel, as: 'hotel', attributes: ['name', 'thumbnail', 'city'] },
        { model: Tour,  as: 'tour',  attributes: ['name', 'thumbnail', 'destination'] },
        { model: Guide, as: 'guide', attributes: ['id'], include: [{ model: User, as: 'user', attributes: ['full_name', 'avatar'] }] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: rows, pagination: { total: count, page: +page, limit: +limit } });
  } catch (err) { next(err); }
};

// GET /api/bookings/:id
exports.getById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        { model: Hotel, as: 'hotel' },
        { model: Tour,  as: 'tour' },
        { model: Guide, as: 'guide', include: [{ model: User, as: 'user', attributes: ['full_name', 'avatar', 'phone'] }] },
      ],
    });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// PATCH /api/bookings/:id/cancel
exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }
    await booking.update({ status: 'cancelled', cancellation_reason: req.body.reason, cancelled_at: new Date() });
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) { next(err); }
};

// PATCH /api/bookings/:id/confirm
exports.confirm = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    await booking.update({ status: 'confirmed' });
    res.json({ success: true, message: 'Booking confirmed', data: booking });
  } catch (err) { next(err); }
};

// PATCH /api/bookings/:id/complete
exports.complete = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    await booking.update({ status: 'completed' });
    res.json({ success: true, message: 'Booking marked as completed' });
  } catch (err) { next(err); }
};

// POST /api/bookings/:id/payment  – stub for payment gateway integration
exports.initiatePayment = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    // TODO: Integrate VNPay/Momo here
    res.json({ success: true, message: 'Payment gateway integration pending', data: { booking_code: booking.booking_code, total: booking.total_price } });
  } catch (err) { next(err); }
};

// GET /api/bookings/admin/all
exports.getAllAdmin = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type)   where.booking_type = type;
    const { count, rows } = await Booking.findAndCountAll({
      where, limit: +limit, offset: (+page - 1) * +limit,
      include: [{ model: User, as: 'customer', attributes: ['full_name', 'email'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: rows, pagination: { total: count, page: +page, limit: +limit } });
  } catch (err) { next(err); }
};
