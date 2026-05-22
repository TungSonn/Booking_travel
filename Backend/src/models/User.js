const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  avatar: { type: DataTypes.STRING(255), allowNull: true },
  role: {
    type: DataTypes.ENUM('customer', 'guide', 'hotel_owner', 'admin'),
    defaultValue: 'customer',
  },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  email_verify_token: { type: DataTypes.STRING, allowNull: true },
  reset_password_token: { type: DataTypes.STRING, allowNull: true },
  reset_password_expires: { type: DataTypes.DATE, allowNull: true },
  last_login: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
  },
});

User.prototype.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

User.prototype.toSafeJSON = function () {
  const { password, reset_password_token, email_verify_token, ...safe } = this.toJSON();
  return safe;
};

module.exports = User;
