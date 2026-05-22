const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Email failed to ${to}:`, err.message);
  }
};

exports.sendVerificationEmail = (email, token) => {
  const url = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  return sendMail(email, 'Xác minh tài khoản TravelBook', `
    <h2>Chào mừng đến với TravelBook!</h2>
    <p>Nhấn vào nút bên dưới để xác minh email của bạn:</p>
    <a href="${url}" style="background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Xác minh Email</a>
    <p>Link hết hạn sau 24 giờ.</p>
  `);
};

exports.sendPasswordResetEmail = (email, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  return sendMail(email, 'Đặt lại mật khẩu TravelBook', `
    <h2>Yêu cầu đặt lại mật khẩu</h2>
    <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
    <a href="${url}" style="background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Đặt lại mật khẩu</a>
    <p>Link hết hạn sau 1 giờ. Nếu không phải bạn, hãy bỏ qua email này.</p>
  `);
};

exports.sendBookingConfirmationEmail = (email, booking) => {
  return sendMail(email, `Xác nhận đặt chỗ #${booking.booking_code}`, `
    <h2>Đặt chỗ thành công!</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td><b>Mã đặt chỗ:</b></td><td>${booking.booking_code}</td></tr>
      <tr><td><b>Loại:</b></td><td>${booking.booking_type}</td></tr>
      <tr><td><b>Ngày bắt đầu:</b></td><td>${booking.start_date}</td></tr>
      <tr><td><b>Ngày kết thúc:</b></td><td>${booking.end_date}</td></tr>
      <tr><td><b>Tổng tiền:</b></td><td>${Number(booking.total_price).toLocaleString('vi-VN')} VND</td></tr>
      <tr><td><b>Trạng thái:</b></td><td>Chờ xác nhận</td></tr>
    </table>
    <p>Chúng tôi sẽ liên hệ xác nhận trong vòng 24h. Cảm ơn bạn đã tin tưởng TravelBook!</p>
  `);
};
