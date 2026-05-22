const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Guide = sequelize.define('Guide', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  languages: { type: DataTypes.JSON, defaultValue: [] },       // ['Vietnamese','English','French']
  specialties: { type: DataTypes.JSON, defaultValue: [] },     // ['history','food','adventure']
  areas: { type: DataTypes.JSON, defaultValue: [] },           // cities/regions they cover
  price_per_day: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  price_per_half_day: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  currency: { type: DataTypes.STRING(10), defaultValue: 'VND' },
  years_experience: { type: DataTypes.INTEGER, defaultValue: 0 },
  license_number: { type: DataTypes.STRING(100), allowNull: true },
  license_image: { type: DataTypes.STRING(255), allowNull: true },
  gallery: { type: DataTypes.JSON, defaultValue: [] },
  available_days: {
    type: DataTypes.JSON,
    defaultValue: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  },
  max_group_size: { type: DataTypes.INTEGER, defaultValue: 10 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  avg_rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  total_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  total_tours_guided: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'guides',
});

module.exports = Guide;
