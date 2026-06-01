import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function BookingSuccess() {
  return (
    <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: '#fff',
        padding: 'var(--space-10) var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <FiCheckCircle size={80} color="green" style={{ marginBottom: 'var(--space-6)' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
          Đặt chỗ thành công!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: 'var(--space-8)' }}>
          Cảm ơn bạn đã tin tưởng dịch vụ của TravelBook. Yêu cầu đặt chỗ của bạn đã được tiếp nhận và xử lý. 
          Chúng tôi đã gửi thông tin xác nhận qua Email liên hệ của bạn.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ display: 'block', textDecoration: 'none' }}>
            Xem đơn hàng của tôi
          </Link>
          <Link to="/" className="btn btn-outline" style={{ display: 'block', textDecoration: 'none' }}>
            Quay lại Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
