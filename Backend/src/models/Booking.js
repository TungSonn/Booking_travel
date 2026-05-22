const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  booking_code: { type: DataTypes.STRING(20), unique: true },  // BK-20240522-XXXX
  user_id: { type: DataTypes.UUID, allowNull: false },

  // Polymorphic: what is being booked
  booking_type: {
    type: DataTypes.ENUM('hotel', 'tour', 'guide'),
    allowNull: false,
  },
  hotel_id: { type: DataTypes.UUID, allowNull: true },
  tour_id: { type: DataTypes.UUID, allowNull: true },
  guide_id: { type: DataTypes.UUID, allowNull: true },

  // Date range
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },

  // Guests
  adults: { type: DataTypes.INTEGER, defaultValue: 1 },
  children: { type: DataTypes.INTEGER, defaultValue: 0 },

  // Pricing snapshot (avoid price drift over time)
  unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  discount_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  tax_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currency: { type: DataTypes.STRING(10), defaultValue: 'VND' },

  // Status flow: pending → confirmed → completed | cancelled
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'refunded'),
    defaultValue: 'pending',
  },

  // Payment
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'partially_paid', 'refunded'),
    defaultValue: 'unpaid',
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'bank_transfer', 'vnpay', 'momo', 'credit_card'),
    allowNull: true,
  },
  payment_id: { type: DataTypes.STRING(255), allowNull: true },
  paid_at: { type: DataTypes.DATE, allowNull: true },

  // Special requests
  special_requests: { type: DataTypes.TEXT, allowNull: true },
  cancellation_reason: { type: DataTypes.TEXT, allowNull: true },
  cancelled_at: { type: DataTypes.DATE, allowNull: true },

  // Contact snapshot
  contact_name: { type: DataTypes.STRING(100), allowNull: false },
  contact_email: { type: DataTypes.STRING(150), allowNull: false },
  contact_phone: { type: DataTypes.STRING(20), allowNull: false },
}, {
  tableName: 'bookings',
  hooks: {
    beforeCreate: (booking) => {
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
      const rand = Math.random().toString(36).substring(2,6).toUpperCase();
      booking.booking_code = `BK-${dateStr}-${rand}`;
    },
  },
});

module.exports = Booking;
