const { Guide, User, Review, Booking } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { area, language, specialty, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const where = { is_active: true };
    if (area)      where.areas      = { [Op.like]: `%${area}%` };
    if (language)  where.languages  = { [Op.like]: `%${language}%` };
    if (specialty) where.specialties = { [Op.like]: `%${specialty}%` };
    if (minPrice || maxPrice) {
      where.price_per_day = {};
      if (minPrice) where.price_per_day[Op.gte] = minPrice;
      if (maxPrice) where.price_per_day[Op.lte] = maxPrice;
    }
    const { count, rows } = await Guide.findAndCountAll({
      where, limit: +limit, offset: (+page - 1) * +limit,
      include: [{ model: User, as: 'user', attributes: ['full_name', 'avatar', 'email'] }],
      order: [['avg_rating', 'DESC']],
    });
    res.json({ success: true, data: rows, pagination: { total: count, page: +page, limit: +limit } });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const guide = await Guide.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'avatar', 'email', 'phone'] },
        { model: Review, as: 'reviews', limit: 5, order: [['created_at', 'DESC']] },
      ],
    });
    if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
    res.json({ success: true, data: guide });
  } catch (err) { next(err); }
};

exports.getCalendar = async (req, res, next) => {
  try {
    const { month } = req.query; // YYYY-MM
    const startDate = `${month}-01`;
    const endDate   = `${month}-31`;
    const bookings = await Booking.findAll({
      where: {
        guide_id: req.params.id,
        start_date: { [Op.gte]: startDate },
        end_date:   { [Op.lte]: endDate },
        status: { [Op.in]: ['pending', 'confirmed'] },
      },
      attributes: ['start_date', 'end_date', 'status'],
    });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

exports.createProfile = async (req, res, next) => {
  try {
    const exists = await Guide.findOne({ where: { user_id: req.user.id } });
    if (exists) return res.status(409).json({ success: false, message: 'Guide profile already exists' });
    const data = { ...req.body, user_id: req.user.id };
    if (req.files?.gallery) data.gallery = req.files.gallery.map(f => f.filename);
    const guide = await Guide.create(data);
    res.status(201).json({ success: true, data: guide });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const guide = await Guide.findOne({ where: { user_id: req.user.id } });
    if (!guide) return res.status(404).json({ success: false, message: 'Guide profile not found' });
    const data = { ...req.body };
    if (req.files?.gallery) data.gallery = req.files.gallery.map(f => f.filename);
    await guide.update(data);
    res.json({ success: true, data: guide });
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    const guide = await Guide.findByPk(req.params.id);
    if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
    await guide.update({ is_verified: true });
    res.json({ success: true, message: 'Guide verified' });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const guide = await Guide.findByPk(req.params.id);
    if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });
    await guide.destroy();
    res.json({ success: true, message: 'Guide removed' });
  } catch (err) { next(err); }
};
