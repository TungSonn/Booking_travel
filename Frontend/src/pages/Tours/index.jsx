import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiStar, FiClock, FiUsers } from 'react-icons/fi';
import { tourService } from '@services/index';

const CATEGORIES = ['adventure','cultural','beach','city','nature','luxury','budget'];
const LABELS = { adventure:'Khám phá', cultural:'Văn hoá', beach:'Biển đảo', city:'Thành phố', nature:'Thiên nhiên', luxury:'Sang trọng', budget:'Tiết kiệm' };

export default function ToursPage() {
  const [filters, setFilters] = useState({ destination:'', category:'', minPrice:'', maxPrice:'', days:'', page:1 });

  const { data, isLoading } = useQuery({
    queryKey: ['tours', filters],
    queryFn: () => tourService.getAll(filters),
  });

  const update = (key, val) => setFilters(f => ({ ...f, [key]: val, page:1 }));

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom:'var(--space-2)' }}>Tour Du Lịch</h1>
        <p className="section-subtitle">Hàng trăm hành trình đang chờ bạn khám phá</p>

        {/* Category pills */}
        <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap', marginBottom:'var(--space-6)' }}>
          <button className={`btn btn-sm ${!filters.category ? 'btn-primary' : 'btn-ghost'}`} onClick={() => update('category','')}>Tất cả</button>
          {CATEGORIES.map(c => (
            <button key={c} className={`btn btn-sm ${filters.category===c ? 'btn-primary' : 'btn-ghost'}`} onClick={() => update('category', c)}>
              {LABELS[c]}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap', marginBottom:'var(--space-8)', padding:'var(--space-4)', background:'var(--color-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)' }}>
          <input className="input" style={{ flex:1, minWidth:160 }} placeholder="Điểm đến..." value={filters.destination} onChange={e => update('destination', e.target.value)} />
          <input className="input" style={{ minWidth:120 }} type="number" placeholder="Số ngày" value={filters.days} onChange={e => update('days', e.target.value)} />
          <input className="input" style={{ minWidth:130 }} type="number" placeholder="Giá từ (₫)" value={filters.minPrice} onChange={e => update('minPrice', e.target.value)} />
          <input className="input" style={{ minWidth:130 }} type="number" placeholder="Giá đến (₫)" value={filters.maxPrice} onChange={e => update('maxPrice', e.target.value)} />
          <button className="btn btn-primary"><FiSearch /> Tìm</button>
        </div>

        {isLoading ? (
          <div style={{ textAlign:'center', padding:'var(--space-16)' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
        ) : (
          <>
            <p style={{ color:'var(--color-text-muted)', marginBottom:'var(--space-6)', fontSize:'var(--text-sm)' }}>
              Tìm thấy <strong>{data?.pagination?.total || 0}</strong> tour
            </p>
            <div className="grid-3">
              {(data?.data || []).map(tour => (
                <Link to={`/tours/${tour.slug}`} key={tour.id} className="card">
                  <div style={{ position:'relative' }}>
                    <img src={`/uploads/tours/${tour.thumbnail}`} alt={tour.name} style={{ width:'100%', height:210, objectFit:'cover' }} />
                    <span className="badge badge-primary" style={{ position:'absolute', top:12, left:12 }}>{LABELS[tour.category]}</span>
                    {tour.is_featured && (
                      <span className="badge badge-warning" style={{ position:'absolute', top:12, right:12 }}>⭐ Nổi bật</span>
                    )}
                  </div>
                  <div style={{ padding:'var(--space-5)' }}>
                    <h3 style={{ fontSize:'var(--text-base)', fontWeight:600, marginBottom:'var(--space-3)' }}>{tour.name}</h3>
                    <div style={{ display:'flex', gap:'var(--space-4)', marginBottom:'var(--space-4)', color:'var(--color-text-muted)', fontSize:'var(--text-xs)' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}><FiClock size={12}/>{tour.duration_days}N{tour.duration_nights}Đ</span>
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}><FiUsers size={12}/>Tối đa {tour.max_group_size}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <FiStar size={14} color="var(--color-accent)" />
                        <span style={{ fontWeight:600, fontSize:'var(--text-sm)' }}>{tour.avg_rating}</span>
                        <span style={{ color:'var(--color-text-muted)', fontSize:'var(--text-xs)' }}>({tour.total_reviews})</span>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ color:'var(--color-primary)', fontWeight:700 }}>
                          {Number(tour.price_per_person).toLocaleString('vi-VN')}₫
                        </div>
                        <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>/người</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
