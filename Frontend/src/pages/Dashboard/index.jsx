import React, { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@services/index';
import { FiCalendar, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiGrid, FiList } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const queryClient = useQueryClient();

  // Fetch current user's bookings
  const { data: bookingsResponse, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingService.getMyBookings()
  });

  const bookings = bookingsResponse?.data || [];

  // Filter specific data based on bookings
  const toursBooked = bookings.filter(b => b.booking_type === 'tour');
  
  // Completed bookings that can be reviewed
  const completedBookings = bookings.filter(b => b.status === 'completed');

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => bookingService.cancel(id, reason),
    onSuccess: () => {
      toast.success('Hủy đơn đặt chỗ thành công!');
      queryClient.invalidateQueries(['my-bookings']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Không thể hủy đặt chỗ.');
    }
  });

  const handleCancel = (id) => {
    const reason = prompt('Vui lòng nhập lý do hủy đặt chỗ:');
    if (reason === null) return; // user cancelled prompt
    if (!reason.trim()) {
      toast.error('Lý do hủy không được để trống.');
      return;
    }
    cancelMutation.mutate({ id, reason });
  };

  return (
    <div className="section" style={{ background: 'var(--color-bg-alt)', minHeight: '85vh' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 className="section-title" style={{ marginBottom: 'var(--space-1)' }}>Bảng điều khiển của tôi</h1>
          <p className="section-subtitle">Xin chào, <strong>{user?.full_name}</strong>. Quản lý hoạt động du lịch của bạn tại đây.</p>
        </div>

        {/* Dynamic Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          <div
            onClick={() => setActiveTab('bookings')}
            style={{
              background: '#fff',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${activeTab === 'bookings' ? 'var(--color-primary)' : 'transparent'}`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s'
            }}
          >
            <div>
              <h4 style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Tổng đơn đặt chỗ</h4>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                {bookings.length}
              </h2>
            </div>
            <div style={{ background: 'rgba(14,165,233,0.1)', padding: '12px', borderRadius: '50%' }}>
              <FiList size={24} color="var(--color-primary)" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('tours')}
            style={{
              background: '#fff',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${activeTab === 'tours' ? 'var(--color-primary)' : 'transparent'}`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s'
            }}
          >
            <div>
              <h4 style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Tour du lịch đặt mua</h4>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-accent)', marginTop: '4px' }}>
                {toursBooked.length}
              </h2>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', padding: '12px', borderRadius: '50%' }}>
              <FiCalendar size={24} color="var(--color-accent)" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('reviews')}
            style={{
              background: '#fff',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${activeTab === 'reviews' ? 'var(--color-primary)' : 'transparent'}`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s'
            }}
          >
            <div>
              <h4 style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Chờ đánh giá</h4>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'green', marginTop: '4px' }}>
                {completedBookings.length}
              </h2>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '50%' }}>
              <FiCheckCircle size={24} color="green" />
            </div>
          </div>
        </div>

        {/* Details list based on active tab */}
        <div style={{
          background: '#fff',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          overflowX: 'auto'
        }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : (
            <>
              {activeTab === 'bookings' && (
                <>
                  <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Đơn đặt dịch vụ của tôi</h2>
                  {bookings.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>Bạn chưa đặt bất kỳ dịch vụ nào.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)' }}>
                          <th style={{ padding: '12px 16px' }}>Mã đặt chỗ</th>
                          <th style={{ padding: '12px 16px' }}>Loại dịch vụ</th>
                          <th style={{ padding: '12px 16px' }}>Ngày bắt đầu</th>
                          <th style={{ padding: '12px 16px' }}>Ngày kết thúc</th>
                          <th style={{ padding: '12px 16px' }}>Tổng thanh toán</th>
                          <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                          <th style={{ padding: '12px 16px' }}>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace' }}>
                              {b.booking_code || b.id.substring(0, 8).toUpperCase()}
                            </td>
                            <td style={{ padding: '12px 16px', textTransform: 'uppercase', fontWeight: 600 }}>{b.booking_type}</td>
                            <td style={{ padding: '12px 16px' }}>{b.start_date}</td>
                            <td style={{ padding: '12px 16px' }}>{b.end_date}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--color-primary)', fontWeight: 700 }}>
                              {Number(b.total_price).toLocaleString('vi-VN')}₫
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className={`badge ${
                                b.status === 'confirmed' ? 'badge-success' :
                                b.status === 'completed' ? 'badge-primary' :
                                b.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                              }`} style={{ textTransform: 'uppercase' }}>
                                {b.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              {b.status === 'pending' && (
                                <button
                                  className="btn btn-outline btn-sm"
                                  style={{ color: 'red', borderColor: 'red' }}
                                  onClick={() => handleCancel(b.id)}
                                >
                                  Hủy đặt chỗ
                                </button>
                              )}
                              {b.status !== 'pending' && <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>Không khả dụng</span>}
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
                  <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Các tour du lịch của tôi</h2>
                  {toursBooked.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>Bạn chưa đăng ký tham gia tour du lịch nào.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)' }}>
                          <th style={{ padding: '12px 16px' }}>Mã đặt chỗ</th>
                          <th style={{ padding: '12px 16px' }}>Ngày đi</th>
                          <th style={{ padding: '12px 16px' }}>Ngày về</th>
                          <th style={{ padding: '12px 16px' }}>Tổng số tiền</th>
                          <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {toursBooked.map((b) => (
                          <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace' }}>
                              {b.booking_code || b.id.substring(0, 8).toUpperCase()}
                            </td>
                            <td style={{ padding: '12px 16px' }}>{b.start_date}</td>
                            <td style={{ padding: '12px 16px' }}>{b.end_date}</td>
                            <td style={{ padding: '12px 16px', color: 'var(--color-primary)', fontWeight: 700 }}>
                              {Number(b.total_price).toLocaleString('vi-VN')}₫
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className={`badge ${
                                b.status === 'confirmed' ? 'badge-success' :
                                b.status === 'completed' ? 'badge-primary' :
                                b.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                              }`} style={{ textTransform: 'uppercase' }}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {activeTab === 'reviews' && (
                <>
                  <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>Đánh giá hành trình đã qua</h2>
                  {completedBookings.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>Chưa có chuyến đi hoàn thành nào chờ đánh giá.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      {completedBookings.map((b) => (
                        <div key={b.id} style={{
                          border: '1px solid var(--color-border)',
                          padding: 'var(--space-4)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'var(--color-bg-alt)'
                        }}>
                          <div>
                            <h4 style={{ fontWeight: 600, textTransform: 'capitalize' }}>Chuyến đi: {b.booking_type}</h4>
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                              Mã đơn: <b style={{ fontFamily: 'monospace' }}>{b.booking_code || b.id.substring(0,8).toUpperCase()}</b> | Thời gian: {b.start_date} → {b.end_date}
                            </p>
                          </div>
                          <button
                            className="btn btn-accent btn-sm"
                            onClick={() => {
                              const rating = prompt('Vui lòng đánh giá chuyến đi (từ 1 đến 5 sao):');
                              const comment = prompt('Nhập nhận xét của bạn:');
                              if (rating && comment) {
                                toast.success('Cảm ơn bạn đã đóng góp nhận xét!');
                              }
                            }}
                          >
                            Viết đánh giá
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
