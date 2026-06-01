import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tourService } from '@services/index';
import { FiStar, FiMapPin, FiCalendar, FiClock, FiUsers, FiCheck, FiX } from 'react-icons/fi';

export default function TourDetail() {
  const { slug } = useParams();
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['tours', slug],
    queryFn: () => tourService.getBySlug(slug)
  });

  if (isLoading) return <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  if (error || !response?.data) return <div style={{ textAlign: 'center', padding: 'var(--space-20)', color: 'red' }}><h2>Không tìm thấy tour du lịch</h2></div>;

  const tour = response.data;

  // Helper function to safe parse JSON fields
  const safeParse = (field) => {
    try {
      return typeof field === 'string' ? JSON.parse(field) : (field || []);
    } catch (e) {
      return field || [];
    }
  };

  const highlights = safeParse(tour.highlights);
  const itinerary = safeParse(tour.itinerary);
  const includes = safeParse(tour.includes);
  const excludes = safeParse(tour.excludes);

  const [startDate, setStartDate] = React.useState('');

  return (
    <div className="section">
      <div className="container">
        {/* Header section */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 'var(--space-8)'
        }}>
          <img
            src={`/uploads/tours/${tour.thumbnail}`}
            alt={tour.name}
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
          />

          <div style={{ padding: 'var(--space-6)' }}>
            <span className="badge badge-primary" style={{ marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>{tour.category}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>{tour.name}</h1>
            
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiMapPin /> Khởi hành: {tour.departure_city} → Điểm đến: {tour.destination}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiClock /> {tour.duration_days} ngày / {tour.duration_nights} đêm</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiUsers /> Nhóm khách tối đa: {tour.max_group_size} người</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Đánh giá</div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiStar color="var(--color-accent)" size={16} /> {tour.avg_rating || '5.0'} ({tour.total_reviews} reviews)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Độ khó</div>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{tour.difficulty}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Giá mỗi khách</div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {Number(tour.price_per_person).toLocaleString('vi-VN')}₫ <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--color-text-muted)' }}>/ người</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
          {/* Left Column */}
          <div>
            {/* Description */}
            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: 'var(--space-2)' }}>Chi tiết tour</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--color-text)' }}>{tour.description}</p>
            </div>

            {/* Highlights */}
            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: 'var(--space-2)' }}>Điểm nhấn hành trình</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiCheck color="green" /> <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: 'var(--space-2)' }}>Lịch trình chi tiết</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {itinerary.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ background: 'var(--color-primary)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                        {step.day || i+1}
                      </div>
                      {i < itinerary.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--color-border)', marginTop: '4px' }} />}
                    </div>
                    <div style={{ paddingBottom: 'var(--space-4)' }}>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: '4px' }}>{step.title}</h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Includes & Excludes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', color: 'green' }}>Giá bao gồm</h3>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {includes.map((inc, i) => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheck color="green" /> {inc}</li>)}
                </ul>
              </div>
              <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', color: 'red' }}>Giá không bao gồm</h3>
                <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {excludes.map((exc, i) => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiX color="red" /> {exc}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '20px' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)', color: 'var(--color-primary)' }}>Đặt Tour ngay</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '4px' }}>Ngày xuất phát</label>
                  <input type="date" className="input" style={{ width: '100%' }} value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '4px' }}>Số lượng người lớn</label>
                  <input type="number" className="input" defaultValue={1} min={1} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '4px' }}>Số lượng trẻ em</label>
                  <input type="number" className="input" defaultValue={0} min={0} style={{ width: '100%' }} />
                </div>
                <Link to={`/booking/tour/${tour.id}?checkIn=${startDate}&checkOut=${startDate}`} className="btn btn-accent" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                  Tiếp tục đặt tour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
