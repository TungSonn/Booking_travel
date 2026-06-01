import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { bookingService } from '@services/index';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { type, id } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const queryCheckIn = searchParams.get('checkIn') || '';
  const queryCheckOut = searchParams.get('checkOut') || '';

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [startDate, setStartDate] = useState(queryCheckIn);
  const [endDate, setEndDate] = useState(queryCheckOut);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !startDate || !endDate) {
      toast.error('Vui lòng nhập đầy đủ thông tin đặt chỗ');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        booking_type: type,
        start_date: startDate,
        end_date: endDate,
        contact_name: fullName,
        contact_email: email,
        contact_phone: phone,
        adults: 1
      };

      if (type === 'hotel') payload.hotel_id = id;
      else if (type === 'tour') payload.tour_id = id;
      else if (type === 'guide') payload.guide_id = id;

      await bookingService.create(payload);
      toast.success('Đặt chỗ thành công!');
      navigate('/booking/success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn đặt chỗ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 className="section-title">Thông tin đặt chỗ</h1>
        <p className="section-subtitle">Loại đặt chỗ: <span style={{ textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700 }}>{type}</span></p>

        <form onSubmit={handleSubmit} style={{
          background: '#fff',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Họ tên liên hệ *</label>
            <input type="text" className="input" style={{ width: '100%' }} value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Email liên hệ *</label>
            <input type="email" className="input" style={{ width: '100%' }} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Số điện thoại liên hệ *</label>
            <input type="text" className="input" style={{ width: '100%' }} value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Ngày bắt đầu *</label>
              <input type="date" className="input" style={{ width: '100%' }} value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>Ngày kết thúc *</label>
              <input type="date" className="input" style={{ width: '100%' }} value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-accent btn-lg" style={{ marginTop: 'var(--space-4)', width: '100%', cursor: 'pointer' }}>
            {loading ? 'Đang xử lý đặt chỗ...' : 'Xác nhận đặt chỗ'}
          </button>
        </form>
      </div>
    </div>
  );
}
