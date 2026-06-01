import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '@services/index';
import { FiStar, FiMapPin, FiCalendar, FiUsers, FiAward } from 'react-icons/fi';

export default function HotelDetail() {
  const { slug } = useParams();
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['hotels', slug],
    queryFn: () => hotelService.getBySlug(slug)
  });

  if (isLoading) return <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  if (error || !response?.data) return <div style={{ textAlign: 'center', padding: 'var(--space-20)', color: 'red' }}><h2>Không tìm thấy khách sạn</h2></div>;

  const hotel = response.data;

  // Safe JSON parse for amenities
  let amenities = [];
  try {
    amenities = typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : (hotel.amenities || []);
  } catch (e) {
    amenities = hotel.amenities || [];
  }

  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');
  const [guests, setGuests] = React.useState('1');

  return (
    <div className="section">
      <div className="container">
        {/* Banner / Main Info */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 'var(--space-8)'
        }}>
          <img
            src={`/uploads/hotels/${hotel.thumbnail}`}
            alt={hotel.name}
            style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
          />

          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: 'var(--space-2)' }}>
              {Array.from({ length: hotel.star_rating || 5 }).map((_, i) => (
                <FiStar key={i} size={16} color="var(--color-accent)" fill="var(--color-accent)" />
              ))}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>{hotel.name}</h1>
            
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              <FiMapPin /> {hotel.address}, {hotel.city}, {hotel.province}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Đánh giá</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiStar color="var(--color-accent)" size={16} /> {hotel.avg_rating || '5.0'} ({hotel.total_reviews} reviews)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Thời gian</div>
                  <div style={{ fontWeight: 600 }}>Check-in: {hotel.check_in_time} | Check-out: {hotel.check_out_time}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Giá phòng từ</div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {Number(hotel.price_per_night).toLocaleString('vi-VN')}₫ <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ đêm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content details */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
          {/* Left column */}
          <div>
            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: 'var(--space-2)' }}>Giới thiệu</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--color-text)' }}>{hotel.description || 'Chưa có mô tả chi tiết cho khách sạn này.'}</p>
            </div>

            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: 'var(--space-2)' }}>Tiện ích khách sạn</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {amenities.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'capitalize' }}>
                    <FiAward color="var(--color-primary)" /> {item.replace('_', ' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column (Booking form stub) */}
          <div>
            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '20px' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>Đặt chỗ ngay</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '4px' }}>Ngày nhận phòng</label>
                  <input type="date" className="input" style={{ width: '100%' }} value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '4px' }}>Ngày trả phòng</label>
                  <input type="date" className="input" style={{ width: '100%' }} value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '4px' }}>Số lượng khách</label>
                  <select className="input" style={{ width: '100%' }} value={guests} onChange={e => setGuests(e.target.value)}>
                    <option value="1">1 người lớn</option>
                    <option value="2">2 người lớn</option>
                    <option value="4">4 người lớn</option>
                  </select>
                </div>
                <Link to={`/booking/hotel/${hotel.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`} className="btn btn-accent" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                  Tiếp tục đặt phòng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
