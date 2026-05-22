const { Tour, Review } = require('../models');
const { Op } = require('sequelize');
const slugify = require('slug');

exports.getAll = async (req, res, next) => {
  try {
    const { destination, category, minPrice, maxPrice, days, difficulty, page = 1, limit = 12 } = req.query;
    const where = { is_active: true };
    if (destination) where.destination = { [Op.like]: `%${destination}%` };
    if (category)    where.category = category;
    if (difficulty)  where.difficulty = difficulty;
    if (days)        where.duration_days = days;
    if (minPrice || maxPrice) {
      where.price_per_person = {};
      if (minPrice) where.price_per_person[Op.gte] = minPrice;
      if (maxPrice) where.price_per_person[Op.lte] = maxPrice;
    }
    const { count, rows } = await Tour.findAndCountAll({
      where, limit: +limit, offset: (+page - 1) * +limit,
      order: [['avg_rating', 'DESC']],
    });
    res.json({ success: true, data: rows, pagination: { total: count, page: +page, limit: +limit, pages: Math.ceil(count / +limit) } });
  } catch (err) { next(err); }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const tours = await Tour.findAll({ where: { is_featured: true, is_active: true }, limit: 8, order: [['avg_rating', 'DESC']] });
    res.json({ success: true, data: tours });
  } catch (err) { next(err); }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const tour = await Tour.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [{ model: Review, as: 'reviews', limit: 5, order: [['created_at', 'DESC']] }],
    });
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, data: tour });
  } catch (err) { next(err); }
};

exports.getSchedules = async (req, res, next) => {
  // TODO: implement TourSchedule model
  res.json({ success: true, data: [], message: 'Implement TourSchedule model' });
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, created_by: req.user.id };
    data.slug = slugify(data.name, { lower: true }) + '-' + Date.now();
    if (req.files?.thumbnail?.[0]) data.thumbnail = req.files.thumbnail[0].filename;
    if (req.files?.images)         data.images = req.files.images.map(f => f.filename);
    const tour = await Tour.create(data);
    res.status(201).json({ success: true, data: tour });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    const data = { ...req.body };
    if (req.files?.thumbnail?.[0]) data.thumbnail = req.files.thumbnail[0].filename;
    if (req.files?.images)         data.images = req.files.images.map(f => f.filename);
    await tour.update(data);
    res.json({ success: true, data: tour });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    await tour.destroy();
    res.json({ success: true, message: 'Tour deleted' });
  } catch (err) { next(err); }
};

exports.toggleFeatured = async (req, res, next) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    await tour.update({ is_featured: !tour.is_featured });
    res.json({ success: true, data: tour });
  } catch (err) { next(err); }
};
