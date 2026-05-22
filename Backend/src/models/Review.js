const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  booking_id: { type: DataTypes.UUID, allowNull: false },  // review tied to a booking

  // Polymorphic target
  review_type: { type: DataTypes.ENUM('hotel', 'tour', 'guide'), allowNull: false },
  hotel_id: { type: DataTypes.UUID, allowNull: true },
  tour_id: { type: DataTypes.UUID, allowNull: true },
  guide_id: { type: DataTypes.UUID, allowNull: true },

  rating: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
  title: { type: DataTypes.STRING(200), allowNull: true },
  comment: { type: DataTypes.TEXT, allowNull: false },
  images: { type: DataTypes.JSON, defaultValue: [] },

  // Sub-ratings (optional)
  cleanliness_rating: { type: DataTypes.TINYINT, allowNull: true },
  service_rating: { type: DataTypes.TINYINT, allowNull: true },
  value_rating: { type: DataTypes.TINYINT, allowNull: true },
  location_rating: { type: DataTypes.TINYINT, allowNull: true },

  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },  // booked = verified
  helpful_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  reply: { type: DataTypes.TEXT, allowNull: true },         // owner/guide reply
  replied_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'reviews',
});

module.exports = Review;
