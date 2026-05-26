import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiStar, FiMapPin, FiFilter } from 'react-icons/fi';
import { hotelService } from '@services/index';

const CITIES = ['Hà Nội','Hồ Chí Minh','Đà Nẵng','Hội An','Nha Trang','Phú Quốc','Đà Lạt','Huế'];

export default function HotelsPage() {
  const [filters, setFilters] = useState({ city:'', star:'', minPrice:'', maxPrice:'', page:1 });

  const { data, isLoading } = useQuery({
    queryKey: ['hotels', filters],
    queryFn: () => hotelService.getAll(filters),
  });

  const update = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom:'var(--space-2)' }}>Khách sạn</h1>
        <p className="section-subtitle">Tìm chỗ nghỉ hoàn hảo cho chuyến đi của bạn</p>

        {/* Filter bar */}
        <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap', marginBottom:'var(--space-8)', padding:'var(--space-4)', background:'var(--color-surface)', borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', boxShadow:'var(--shadow-sm)' }}>
          <select className="input" style={{ flex:1, minWidth:150 }} value={filters.city} onChange={e => update('city', e.target.value)}>
            <option value="">Tất cả thành phố</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input" style={{ minWidth:130 }} value={filters.star} onChange={e => update('star', e.target.value)}>
            <option value="">Số sao</option>
            {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} sao</option>)}
          </select>
          <input className="input" style={{ minWidth:130 }} type="number" placeholder="Giá tối thiểu" value={filters.minPrice} onChange={e => update('minPrice', e.target.value)} />
          <input className="input" style={{ minWidth:130 }} type="number" placeholder="Giá tối đa" value={filters.maxPrice} onChange={e => update('maxPrice', e.target.value)} />
          <button className="btn btn-primary" onClick={() => setFilters(f => ({ ...f, page:1 }))}>
            <FiSearch /> Tìm
          </button>
        </div>

        {/* Results */}
        {isLoading ? (
          <div style={{ textAlign:'center', padding:'var(--space-16)' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
        ) : (
          <>
            <p style={{ color:'var(--color-text-muted)', marginBottom:'var(--space-6)', fontSize:'var(--text-sm)' }}>
              Tìm thấy <strong>{data?.pagination?.total || 0}</strong> khách sạn
            </p>
            <div className="grid-3">
              {(data?.data || []).map(hotel => (
                <Link to={`/hotels/${hotel.slug}`} key={hotel.id} className="card">
                  <div style={{ position:'relative' }}>
                    <img src={`/uploads/hotels/${hotel.thumbnail}`} alt={hotel.name} style={{ width:'100%', height:210, objectFit:'cover' }} />
                    {hotel.is_verified && (
                      <span className="badge badge-success" style={{ position:'absolute', top:12, left:12 }}>✓ Đã xác minh</span>
                    )}
                  </div>
                  <div style={{ padding:'var(--space-5)' }}>
                    <div style={{ display:'flex', gap:2, marginBottom:'var(--space-2)' }}>
                      {Array.from({ length: hotel.star_rating || 3 }).map((_, i) => <FiStar key={i} size={12} color="var(--color-accent)" />)}
                    </div>
                    <h3 style={{ fontSize:'var(--text-base)', fontWeight:600, marginBottom:'var(--space-2)' }}>{hotel.name}</h3>
                    <p style={{ display:'flex', alignItems:'center', gap:4, fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginBottom:'var(--space-4)' }}>
                      <FiMapPin size={12} />{hotel.city}, {hotel.province}
                    </p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <FiStar size={14} color="var(--color-accent)" />
                        <span style={{ fontWeight:600, fontSize:'var(--text-sm)' }}>{hotel.avg_rating}</span>
                        <span style={{ color:'var(--color-text-muted)', fontSize:'var(--text-xs)' }}>({hotel.total_reviews})</span>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ color:'var(--color-primary)', fontWeight:700, fontSize:'var(--text-base)' }}>
                          {Number(hotel.price_per_night).toLocaleString('vi-VN')}₫
                        </div>
                        <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>/đêm</div>
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
