const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tour = sequelize.define('Tour', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  created_by: { type: DataTypes.UUID, allowNull: false }, // admin or tour company
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(250), unique: true },
  description: { type: DataTypes.TEXT },
  highlights: { type: DataTypes.JSON, defaultValue: [] },
  itinerary: { type: DataTypes.JSON, defaultValue: [] }, // [{day, title, description}]
  includes: { type: DataTypes.JSON, defaultValue: [] },  // what's included
  excludes: { type: DataTypes.JSON, defaultValue: [] },  // what's not included
  destination: { type: DataTypes.STRING(150), allowNull: false },
  departure_city: { type: DataTypes.STRING(100), allowNull: false },
  duration_days: { type: DataTypes.INTEGER, allowNull: false },
  duration_nights: { type: DataTypes.INTEGER, allowNull: false },
  max_group_size: { type: DataTypes.INTEGER, defaultValue: 20 },
  min_group_size: { type: DataTypes.INTEGER, defaultValue: 1 },
  price_per_person: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  price_child: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  currency: { type: DataTypes.STRING(10), defaultValue: 'VND' },
  category: {
    type: DataTypes.ENUM('adventure', 'cultural', 'beach', 'city', 'nature', 'luxury', 'budget'),
    defaultValue: 'cultural',
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'moderate', 'challenging'),
    defaultValue: 'easy',
  },
  thumbnail: { type: DataTypes.STRING(255) },
  images: { type: DataTypes.JSON, defaultValue: [] },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  avg_rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  total_bookings: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'tours',
});

module.exports = Tour;
