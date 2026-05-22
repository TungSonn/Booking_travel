const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Hotel = sequelize.define('Hotel', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  owner_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(250), unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  address: { type: DataTypes.STRING(255), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
  province: { type: DataTypes.STRING(100), allowNull: false },
  country: { type: DataTypes.STRING(100), defaultValue: 'Vietnam' },
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
  star_rating: { type: DataTypes.TINYINT, validate: { min: 1, max: 5 } },
  price_per_night: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currency: { type: DataTypes.STRING(10), defaultValue: 'VND' },
  thumbnail: { type: DataTypes.STRING(255), allowNull: true },
  images: { type: DataTypes.JSON, defaultValue: [] },
  amenities: { type: DataTypes.JSON, defaultValue: [] }, // wifi, pool, gym...
  total_rooms: { type: DataTypes.INTEGER, defaultValue: 1 },
  available_rooms: { type: DataTypes.INTEGER, defaultValue: 1 },
  check_in_time: { type: DataTypes.STRING(10), defaultValue: '14:00' },
  check_out_time: { type: DataTypes.STRING(10), defaultValue: '12:00' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  avg_rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'hotels',
});

module.exports = Hotel;
