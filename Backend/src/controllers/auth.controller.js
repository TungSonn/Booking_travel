const { User } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');
const crypto = require('crypto');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { full_name, email, password, phone, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      full_name, email, password, phone,
      role: ['customer', 'guide', 'hotel_owner'].includes(role) ? role : 'customer',
      email_verify_token: verifyToken,
    });

    await sendVerificationEmail(user.email, verifyToken);
    res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.' });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.is_active) return res.status(403).json({ success: false, message: 'Account deactivated' });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await user.update({ last_login: new Date() });
    res.json({ success: true, data: { user: user.toSafeJSON(), accessToken, refreshToken } });
  } catch (err) { next(err); }
};

// POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email, role: decoded.role });
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  // Client-side token removal; add token blacklist here if needed
  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.user.toSafeJSON() });
};

// PUT /api/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone } = req.body;
    await req.user.update({ full_name, phone });
    res.json({ success: true, data: req.user.toSafeJSON() });
  } catch (err) { next(err); }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    await user.update({
      reset_password_token: token,
      reset_password_expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });
    await sendPasswordResetEmail(user.email, token);
    res.json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (err) { next(err); }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const { Op } = require('sequelize');
    const user = await User.findOne({
      where: { reset_password_token: token, reset_password_expires: { [Op.gt]: new Date() } },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    await user.update({ password, reset_password_token: null, reset_password_expires: null });
    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) { next(err); }
};

// GET /api/auth/verify-email/:token
exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email_verify_token: req.params.token } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid verification token' });
    await user.update({ email_verified: true, email_verify_token: null });
    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) { next(err); }
};
