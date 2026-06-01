import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { guideService } from '@services/index';
import { FiStar, FiMapPin, FiAward, FiSearch } from 'react-icons/fi';

export default function GuidesPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['guides'],
    queryFn: () => guideService.getAll()
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>Hướng dẫn viên</h1>
        <p className="section-subtitle">Đồng hành cùng những người dẫn đường chuyên nghiệp và tận tâm</p>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : (
          <div className="grid-3">
            {(response?.data || []).map(guide => {
              // Safe parse languages
              let languages = [];
              try {
                languages = typeof guide.languages === 'string' ? JSON.parse(guide.languages) : (guide.languages || []);
              } catch (e) { languages = guide.languages || []; }

              return (
                <Link to={`/guides/${guide.id}`} key={guide.id} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ padding: 'var(--space-5)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--color-primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 'var(--text-xl)',
                        color: 'var(--color-primary)'
                      }}>
                        {guide.User?.full_name?.charAt(0) || 'G'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>{guide.User?.full_name || 'Hướng dẫn viên'}</h3>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiAward /> Kinh nghiệm: {guide.years_experience} năm
                        </p>
                      </div>
                    </div>

                    <p style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text)',
                      marginBottom: 'var(--space-4)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '4.5em',
                      lineHeight: '1.5'
                    }}>
                      {guide.bio || 'Chưa có thông tin giới thiệu.'}
                    </p>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Ngôn ngữ</div>
                        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{languages.join(', ')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                          {Number(guide.price_per_day).toLocaleString('vi-VN')}₫
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>/ ngày</div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
