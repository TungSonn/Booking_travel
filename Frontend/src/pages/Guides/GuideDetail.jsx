import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { guideService } from '@services/index';
import { FiStar, FiMapPin, FiAward, FiMessageSquare, FiCalendar, FiGlobe, FiCheck } from 'react-icons/fi';

export default function GuideDetail() {
  const { id } = useParams();
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['guides', id],
    queryFn: () => guideService.getById(id)
  });

  if (isLoading) return <div style={{ textAlign: 'center', padding: 'var(--space-20)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  if (error || !response?.data) return <div style={{ textAlign: 'center', padding: 'var(--space-20)', color: 'red' }}><h2>Không tìm thấy hướng dẫn viên</h2></div>;

  const guide = response.data;

  // Safe parse JSON fields
  const safeParse = (field) => {
    try {
      return typeof field === 'string' ? JSON.parse(field) : (field || []);
    } catch (e) {
      return field || [];
    }
  };

  const languages = safeParse(guide.languages);
  const specialties = safeParse(guide.specialties);
  const areas = safeParse(guide.areas);

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)' }}>
          {/* Left profile card */}
          <div>
            <div style={{
              background: '#fff',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 'var(--text-4xl)',
                color: 'var(--color-primary)',
                margin: '0 auto var(--space-4)'
              }}>
                {guide.User?.full_name?.charAt(0) || 'G'}
              </div>

              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{guide.User?.full_name}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                ⭐ {guide.avg_rating || '5.0'} / 5.0 ({guide.total_reviews} reviews)
              </p>

              <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-4) 0', margin: 'var(--space-4) 0', display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Kinh nghiệm</div>
                  <div style={{ fontWeight: 700 }}>{guide.years_experience} năm</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Số tour dẫn</div>
                  <div style={{ fontWeight: 700 }}>{guide.total_tours_guided}+</div>
                </div>
              </div>

              <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '4px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Giá thuê theo ngày</h4>
                <p style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {Number(guide.price_per_day).toLocaleString('vi-VN')}₫ <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 400 }}>/ ngày</span>
                </p>
              </div>

              <Link to={`/booking/guide/${guide.id}`} className="btn btn-accent" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                Đặt lịch hướng dẫn
              </Link>
            </div>
          </div>

          {/* Right details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Bio */}
            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', borderBottom: '2px solid var(--color-primary-light)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>Giới thiệu bản thân</h2>
              <p style={{ lineHeight: 1.6, color: 'var(--color-text)' }}>{guide.bio || 'Chưa có thông tin giới thiệu.'}</p>
            </div>

            {/* Language & Specialties */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-3)' }}><FiGlobe /> Ngôn ngữ sử dụng</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {languages.map((l, i) => <span key={i} className="badge badge-primary">{l}</span>)}
                </div>
              </div>

              <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-3)' }}><FiAward /> Chuyên môn</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {specialties.map((s, i) => <span key={i} className="badge badge-accent" style={{ textTransform: 'capitalize' }}>{s}</span>)}
                </div>
              </div>
            </div>

            {/* Areas */}
            <div style={{ background: '#fff', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-3)' }}><FiMapPin /> Khu vực hoạt động chính</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {areas.map((a, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--color-bg-alt)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>
                    <FiCheck color="green" /> {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
