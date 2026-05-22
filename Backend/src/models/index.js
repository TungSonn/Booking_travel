const { sequelize } = require('../config/database');
const User    = require('./User');
const Hotel   = require('./Hotel');
const Tour    = require('./Tour');
const Guide   = require('./Guide');
const Booking = require('./Booking');
const Review  = require('./Review');

// ── User ↔ Hotel (owner) ────────────────────────────────────────
User.hasMany(Hotel, { foreignKey: 'owner_id', as: 'hotels' });
Hotel.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// ── User ↔ Guide profile ────────────────────────────────────────
User.hasOne(Guide, { foreignKey: 'user_id', as: 'guide_profile' });
Guide.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ── User ↔ Booking ──────────────────────────────────────────────
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

// ── Hotel ↔ Booking ─────────────────────────────────────────────
Hotel.hasMany(Booking, { foreignKey: 'hotel_id', as: 'bookings' });
Booking.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

// ── Tour ↔ Booking ──────────────────────────────────────────────
Tour.hasMany(Booking, { foreignKey: 'tour_id', as: 'bookings' });
Booking.belongsTo(Tour, { foreignKey: 'tour_id', as: 'tour' });

// ── Guide ↔ Booking ─────────────────────────────────────────────
Guide.hasMany(Booking, { foreignKey: 'guide_id', as: 'bookings' });
Booking.belongsTo(Guide, { foreignKey: 'guide_id', as: 'guide' });

// ── User ↔ Review ───────────────────────────────────────────────
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'reviewer' });

// ── Hotel / Tour / Guide ↔ Review ───────────────────────────────
Hotel.hasMany(Review, { foreignKey: 'hotel_id', as: 'reviews' });
Review.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

Tour.hasMany(Review, { foreignKey: 'tour_id', as: 'reviews' });
Review.belongsTo(Tour, { foreignKey: 'tour_id', as: 'tour' });

Guide.hasMany(Review, { foreignKey: 'guide_id', as: 'reviews' });
Review.belongsTo(Guide, { foreignKey: 'guide_id', as: 'guide' });

// ── Tour ↔ Guide (many-to-many via TourGuide) ───────────────────
Tour.belongsToMany(Guide, { through: 'tour_guides', foreignKey: 'tour_id', as: 'guides' });
Guide.belongsToMany(Tour, { through: 'tour_guides', foreignKey: 'guide_id', as: 'tours' });

module.exports = { sequelize, User, Hotel, Tour, Guide, Booking, Review };
