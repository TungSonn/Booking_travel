import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>404</h1>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>Không tìm thấy trang</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link to="/" className="btn btn-primary">
          Quay lại Trang chủ
        </Link>
      </div>
    </div>
  );
}
