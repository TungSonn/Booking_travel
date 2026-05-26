import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiMapPin, FiStar, FiArrowRight, FiCalendar, FiUsers } from 'react-icons/fi';
import { tourService, hotelService, guideService } from '@services/index';

export default function HomePage() {
  const { data: featured } = useQuery({ queryKey: ['tours','featured'], queryFn: tourService.getFeatured });
  const { data: hotels }   = useQuery({ queryKey: ['hotels','top'],     queryFn: () => hotelService.getAll({ limit: 4, sort: 'avg_rating' }) });
  const { data: guides }   = useQuery({ queryKey: ['guides','top'],     queryFn: () => guideService.getAll({ limit: 4 }) });

  return (
    <div>
      {/* ── Hero ───────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 60%, #0ea5e9 100%)',
        minHeight: '88vh',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* bg decoration */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'url(/images/hero-bg.jpg)', backgroundSize:'cover', backgroundPosition:'center', opacity:0.15 }} />

        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center', padding:'var(--space-20) var(--space-6)' }}>
          <span style={{ display:'inline-block', background:'rgba(14,165,233,0.18)', border:'1px solid rgba(14,165,233,0.35)', borderRadius:'var(--radius-full)', padding:'6px 20px', fontSize:'var(--text-sm)', color:'var(--color-primary-light)', marginBottom:'var(--space-6)', letterSpacing:'0.05em' }}>
            🌏 Khám phá Việt Nam cùng TravelBook
          </span>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,6vw,4.5rem)', color:'#fff', marginBottom:'var(--space-6)', lineHeight:1.15 }}>
            Hành trình của bạn<br />bắt đầu từ <span style={{ color:'var(--color-primary-light)' }}>đây</span>
          </h1>
          <p style={{ fontSize:'var(--text-lg)', color:'rgba(255,255,255,0.7)', maxWidth:600, margin:'0 auto var(--space-10)' }}>
            Đặt khách sạn, tour du lịch và hướng dẫn viên chuyên nghiệp — tất cả trong một nền tảng.
          </p>

          {/* Search bar */}
          <div style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'var(--radius-xl)', padding:'var(--space-4)', maxWidth:800, margin:'0 auto', display:'flex', gap:'var(--space-3)', flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:200, display:'flex', alignItems:'center', gap:'var(--space-2)', background:'rgba(255,255,255,0.1)', borderRadius:'var(--radius-md)', padding:'0 var(--space-4)' }}>
              <FiMapPin color="var(--color-primary-light)" />
              <input placeholder="Điểm đến..." style={{ background:'none', border:'none', outline:'none', color:'#fff', fontSize:'var(--text-sm)', width:'100%', padding:'var(--space-3) 0' }} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', background:'rgba(255,255,255,0.1)', borderRadius:'var(--radius-md)', padding:'0 var(--space-4)' }}>
              <FiCalendar color="var(--color-primary-light)" />
              <input type="date" style={{ background:'none', border:'none', outline:'none', color:'#fff', fontSize:'var(--text-sm)', padding:'var(--space-3) 0' }} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', background:'rgba(255,255,255,0.1)', borderRadius:'var(--radius-md)', padding:'0 var(--space-4)' }}>
              <FiUsers color="var(--color-primary-light)" />
              <select style={{ background:'none', border:'none', outline:'none', color:'#fff', fontSize:'var(--text-sm)', padding:'var(--space-3) 0' }}>
                <option value="1" style={{color:'#000'}}>1 người</option>
                <option value="2" style={{color:'#000'}}>2 người</option>
                <option value="4" style={{color:'#000'}}>4 người</option>
              </select>
            </div>
            <button className="btn btn-accent btn-lg" style={{ borderRadius:'var(--radius-md)' }}>
              <FiSearch /> Tìm kiếm
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:'var(--space-12)', marginTop:'var(--space-12)', flexWrap:'wrap' }}>
            {[['500+','Khách sạn'],['200+','Tour'],['100+','Hướng dẫn viên'],['10K+','Khách hàng']].map(([num, label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'var(--text-3xl)', fontWeight:800, color:'#fff' }}>{num}</div>
                <div style={{ fontSize:'var(--text-sm)', color:'rgba(255,255,255,0.6)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Tours ──────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'var(--space-8)' }}>
            <div>
              <h2 className="section-title">Tour nổi bật</h2>
              <p className="section-subtitle" style={{ marginBottom:0 }}>Những hành trình được yêu thích nhất</p>
            </div>
            <Link to="/tours" className="btn btn-outline btn-sm" style={{ flexShrink:0 }}>Xem tất cả <FiArrowRight /></Link>
          </div>
          <div className="grid-4">
            {(featured?.data || []).map(tour => (
              <Link to={`/tours/${tour.slug}`} key={tour.id} className="card">
                <img src={`/uploads/tours/${tour.thumbnail}`} alt={tour.name} style={{ width:'100%', height:200, objectFit:'cover' }} />
                <div style={{ padding:'var(--space-4)' }}>
                  <span className="badge badge-primary" style={{ marginBottom:'var(--space-2)' }}>{tour.category}</span>
                  <h3 style={{ fontSize:'var(--text-base)', fontFamily:'var(--font-sans)', fontWeight:600, marginBottom:'var(--space-2)' }}>{tour.name}</h3>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <FiStar color="var(--color-accent)" size={14} />
                      <span style={{ fontSize:'var(--text-sm)', fontWeight:600 }}>{tour.avg_rating}</span>
                    </div>
                    <span style={{ color:'var(--color-primary)', fontWeight:700 }}>
                      {Number(tour.price_per_person).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Hotels ──────────────────────────────── */}
      <section className="section" style={{ background:'var(--color-bg-alt)' }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'var(--space-8)' }}>
            <div>
              <h2 className="section-title">Khách sạn nổi bật</h2>
              <p className="section-subtitle" style={{ marginBottom:0 }}>Lựa chọn chỗ nghỉ lý tưởng</p>
            </div>
            <Link to="/hotels" className="btn btn-outline btn-sm">Xem tất cả <FiArrowRight /></Link>
          </div>
          <div className="grid-4">
            {(hotels?.data || []).map(hotel => (
              <Link to={`/hotels/${hotel.slug}`} key={hotel.id} className="card">
                <img src={`/uploads/hotels/${hotel.thumbnail}`} alt={hotel.name} style={{ width:'100%', height:180, objectFit:'cover' }} />
                <div style={{ padding:'var(--space-4)' }}>
                  <div style={{ display:'flex', gap:2, marginBottom:'var(--space-2)' }}>
                    {Array.from({ length: hotel.star_rating || 3 }).map((_, i) => <FiStar key={i} size={12} color="var(--color-accent)" fill="var(--color-accent)" />)}
                  </div>
                  <h3 style={{ fontSize:'var(--text-sm)', fontFamily:'var(--font-sans)', fontWeight:600 }}>{hotel.name}</h3>
                  <p style={{ fontSize:'var(--text-xs)', color:'var(--color-text-muted)', marginTop:4 }}>{hotel.city}</p>
                  <p style={{ color:'var(--color-primary)', fontWeight:700, marginTop:'var(--space-2)' }}>
                    {Number(hotel.price_per_night).toLocaleString('vi-VN')}₫<span style={{ fontWeight:400, color:'var(--color-text-muted)', fontSize:'var(--text-xs)' }}>/đêm</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────── */}
      <section style={{ background:'linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))', padding:'var(--space-16) 0' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'var(--text-4xl)', color:'#fff', marginBottom:'var(--space-4)' }}>Bạn muốn trở thành hướng dẫn viên?</h2>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'var(--text-lg)', marginBottom:'var(--space-8)' }}>Chia sẻ đam mê du lịch và tạo thu nhập với TravelBook</p>
          <Link to="/register" className="btn btn-accent btn-lg">Đăng ký ngay <FiArrowRight /></Link>
        </div>
      </section>
    </div>
  );
}
