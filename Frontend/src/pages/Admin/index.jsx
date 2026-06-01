import React, { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@services/auth.service';
import { hotelService, tourService } from '@services/index';
import { FiUsers, FiHome, FiMap, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Fetch data for each resource
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: authService.getUsers,
    enabled: activeTab === 'users'
  });

  const { data: hotelsData, isLoading: loadingHotels } = useQuery({
    queryKey: ['admin', 'hotels'],
    queryFn: () => hotelService.getAll(),
    enabled: activeTab === 'hotels'
  });

  const { data: toursData, isLoading: loadingTours } = useQuery({
    queryKey: ['admin', 'tours'],
    queryFn: () => tourService.getAll(),
    enabled: activeTab === 'tours'
  });

  return (
    <div className="section" style={{ background: 'var(--color-bg-alt)', minHeight: '85vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div>
            <h1 className="section-title" style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>Trang quản trị Admin</h1>
            <p className="section-subtitle">Chào mừng quay trở lại, {user?.full_name || 'Admin'}</p>
          </div>
        </div>

        {/* Tab Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          <div
            onClick={() => setActiveTab('users')}
            style={{
              background: '#fff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${activeTab === 'users' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ background: 'rgba(14,165,233,0.1)', p: 3, padding: '12px', borderRadius: '50%' }}>
              <FiUsers size={24} color="var(--color-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Người dùng</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: '4px' }}>Quản lý tài khoản hệ thống</p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('hotels')}
            style={{
              background: '#fff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${activeTab === 'hotels' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ background: 'rgba(245,158,11,0.1)', padding: '12px', borderRadius: '50%' }}>
              <FiHome size={24} color="var(--color-accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Khách sạn</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: '4px' }}>Duyệt danh sách lưu trú</p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('tours')}
            style={{
              background: '#fff',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${activeTab === 'tours' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '50%' }}>
              <FiMap size={24} color="green" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Tours</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginTop: '4px' }}>Quản lý lịch trình du lịch</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{
          background: '#fff',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          overflowX: 'auto'
        }}>
          {activeTab === 'users' && (
            <>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Danh sách người dùng</h2>
              {loadingUsers ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ padding: '12px 16px' }}>Họ và tên th</th>
                      <th style={{ padding: '12px 16px' }}>Email</th>
                      <th style={{ padding: '12px 16px' }}>Vai trò</th>
                      <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                      <th style={{ padding: '12px 16px' }}>Xác minh Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(usersData?.data || []).map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.full_name}</td>
                        <td style={{ padding: '12px 16px' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'guide' ? 'badge-accent' : 'badge-primary'}`} style={{ textTransform: 'uppercase' }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {u.is_active ? (
                            <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '4px' }}><FiCheckCircle /> Active</span>
                          ) : (
                            <span style={{ color: 'red', display: 'flex', alignItems: 'center', gap: '4px' }}><FiXCircle /> Blocked</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {u.email_verified ? (
                            <span className="badge badge-success">Đã xác minh</span>
                          ) : (
                            <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>Chưa</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === 'hotels' && (
            <>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Danh sách khách sạn</h2>
              {loadingHotels ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ padding: '12px 16px' }}>Tên khách sạn</th>
                      <th style={{ padding: '12px 16px' }}>Thành phố</th>
                      <th style={{ padding: '12px 16px' }}>Số sao</th>
                      <th style={{ padding: '12px 16px' }}>Giá / Đêm</th>
                      <th style={{ padding: '12px 16px' }}>Xác minh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(hotelsData?.data || []).map((h) => (
                      <tr key={h.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{h.name}</td>
                        <td style={{ padding: '12px 16px' }}>{h.city}</td>
                        <td style={{ padding: '12px 16px' }}>{h.star_rating} ⭐</td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-primary)', fontWeight: 700 }}>
                          {Number(h.price_per_night).toLocaleString('vi-VN')}₫
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {h.is_verified ? (
                            <span className="badge badge-success">✓ Verified</span>
                          ) : (
                            <span className="badge" style={{ background: '#fef3c7', color: '#d97706' }}>Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === 'tours' && (
            <>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Danh sách Tours</h2>
              {loadingTours ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ padding: '12px 16px' }}>Tên Tour</th>
                      <th style={{ padding: '12px 16px' }}>Điểm đến</th>
                      <th style={{ padding: '12px 16px' }}>Thời lượng</th>
                      <th style={{ padding: '12px 16px' }}>Danh mục</th>
                      <th style={{ padding: '12px 16px' }}>Giá vé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(toursData?.data || []).map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{t.name}</td>
                        <td style={{ padding: '12px 16px' }}>{t.destination}</td>
                        <td style={{ padding: '12px 16px' }}>{t.duration_days} ngày</td>
                        <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{t.category}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-primary)', fontWeight: 700 }}>
                          {Number(t.price_per_person).toLocaleString('vi-VN')}₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
