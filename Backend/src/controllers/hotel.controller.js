const { Hotel, Review } = require('../models');
const { Op } = require('sequelize');
const slugify = require('slug');

// GET /api/hotels
exports.getAll = async (req, res, next) => {
  try {
    const { city, province, star, minPrice, maxPrice, page = 1, limit = 12, sort = 'avg_rating' } = req.query;
    const where = { is_active: true };
    if (city)     where.city     = { [Op.like]: `%${city}%` };
    if (province) where.province = { [Op.like]: `%${province}%` };
    if (star)     where.star_rating = star;
    if (minPrice || maxPrice) {
      where.price_per_night = {};
      if (minPrice) where.price_per_night[Op.gte] = minPrice;
      if (maxPrice) where.price_per_night[Op.lte] = maxPrice;
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Hotel.findAndCountAll({
      where, limit: parseInt(limit), offset,
      order: [[sort, 'DESC']],
      attributes: { exclude: ['owner_id'] },
    });
    res.json({ success: true, data: rows, pagination: { total: count, page: +page, limit: +limit, pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

// GET /api/hotels/:slug
exports.getBySlug = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [{ model: Review, as: 'reviews', limit: 5, order: [['created_at', 'DESC']] }],
    });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (err) { next(err); }
};

// GET /api/hotels/:id/rooms  – stub, expand with Room model
exports.getRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    // TODO: query Rooms table once Room model is created
    res.json({ success: true, data: [], message: 'Implement Room model to list rooms' });
  } catch (err) { next(err); }
};

// POST /api/hotels
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, owner_id: req.user.id };
    data.slug = slugify(data.name, { lower: true }) + '-' + Date.now();
    if (req.files?.thumbnail?.[0]) data.thumbnail = req.files.thumbnail[0].filename;
    if (req.files?.images)         data.images = req.files.images.map(f => f.filename);
    const hotel = await Hotel.create(data);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) { next(err); }
};

// PUT /api/hotels/:id
exports.update = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    if (hotel.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const data = { ...req.body };
    if (req.files?.thumbnail?.[0]) data.thumbnail = req.files.thumbnail[0].filename;
    if (req.files?.images)         data.images = req.files.images.map(f => f.filename);
    await hotel.update(data);
    res.json({ success: true, data: hotel });
  } catch (err) { next(err); }
};

// DELETE /api/hotels/:id
exports.remove = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    await hotel.destroy(); // soft delete via paranoid
    res.json({ success: true, message: 'Hotel deleted' });
  } catch (err) { next(err); }
};

// PATCH /api/hotels/:id/verify  – admin only
exports.verify = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    await hotel.update({ is_verified: true });
    res.json({ success: true, message: 'Hotel verified' });
  } catch (err) { next(err); }
};
