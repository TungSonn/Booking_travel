const { Review, User, Hotel, Tour, Guide } = require('../models');

// GET /api/reviews/hotel/:hotelId
exports.getHotelReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { hotel_id: req.params.hotelId, review_type: 'hotel' },
      include: [{ model: User, as: 'reviewer', attributes: ['full_name', 'avatar'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};

// GET /api/reviews/tour/:tourId
exports.getTourReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { tour_id: req.params.tourId, review_type: 'tour' },
      include: [{ model: User, as: 'reviewer', attributes: ['full_name', 'avatar'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};

// GET /api/reviews/guide/:guideId
exports.getGuideReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { guide_id: req.params.guideId, review_type: 'guide' },
      include: [{ model: User, as: 'reviewer', attributes: ['full_name', 'avatar'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};

// POST /api/reviews
exports.create = async (req, res, next) => {
  try {
    const { booking_id, review_type, hotel_id, tour_id, guide_id,
            rating, title, comment, cleanliness_rating, service_rating,
            value_rating, location_rating } = req.body;
    const images = req.files?.images?.map(f => f.filename) || [];

    const review = await Review.create({
      user_id: req.user.id, booking_id, review_type,
      hotel_id, tour_id, guide_id, rating, title, comment,
      cleanliness_rating, service_rating, value_rating, location_rating,
      images, is_verified: true,
    });

    // Update avg_rating on the target entity
    await updateEntityRating(review_type, hotel_id || tour_id || guide_id);
    res.status(201).json({ success: true, data: review });
  } catch (err) { next(err); }
};

const updateEntityRating = async (type, id) => {
  const Model = type === 'hotel' ? Hotel : type === 'tour' ? Tour : Guide;
  const field = `${type}_id`;
  const { sequelize } = require('../config/database');
  const result = await Review.findOne({
    where: { [field]: id, review_type: type },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avg'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    raw: true,
  });
  await Model.update(
    { avg_rating: parseFloat(result.avg || 0).toFixed(2), total_reviews: result.count || 0 },
    { where: { id } }
  );
};

// PATCH /api/reviews/:id/reply
exports.reply = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.update({ reply: req.body.reply, replied_at: new Date() });
    res.json({ success: true, data: review });
  } catch (err) { next(err); }
};

// PATCH /api/reviews/:id/helpful
exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.increment('helpful_count');
    res.json({ success: true, message: 'Marked as helpful' });
  } catch (err) { next(err); }
};

// DELETE /api/reviews/:id
exports.remove = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.destroy();
    res.json({ success: true, message: 'Review removed' });
  } catch (err) { next(err); }
};
