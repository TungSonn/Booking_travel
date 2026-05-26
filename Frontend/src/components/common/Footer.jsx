import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-dark)',
      color: 'rgba(255,255,255,0.75)',
      padding: 'var(--space-16) 0 var(--space-8)',
      marginTop: 'var(--space-16)',
    }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: 'var(--space-12)' }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-4)' }}>
              <FiMapPin color="var(--color-primary)" size={20} />
              <span style={{ fontFamily:'var(--font-display)', fontSize:'var(--text-xl)', color:'#fff' }}>
                Travel<strong style={{ color:'var(--color-primary)' }}>Book</strong>
              </span>
            </div>
            <p style={{ fontSize:'var(--text-sm)', lineHeight:1.7, marginBottom:'var(--space-5)' }}>
              Nền tảng đặt phòng, tour du lịch và hướng dẫn viên hàng đầu Việt Nam.
              Khám phá – Trải nghiệm – Kết nối.
            </p>
            <div style={{ display:'flex', gap:'var(--space-3)' }}>
              {[FiFacebook, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width:36, height:36, borderRadius:'50%',
                  background:'rgba(255,255,255,0.08)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#fff', transition:'background 0.2s',
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Khám phá */}
          <div>
            <h4 style={{ color:'#fff', marginBottom:'var(--space-4)', fontSize:'var(--text-base)' }}>Khám phá</h4>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              {[
                { label: 'Khách sạn', to: '/hotels' },
                { label: 'Tour du lịch', to: '/tours' },
                { label: 'Hướng dẫn viên', to: '/guides' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} style={{ fontSize:'var(--text-sm)', color:'rgba(255,255,255,0.65)', transition:'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color='var(--color-primary)'}
                    onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.65)'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 style={{ color:'#fff', marginBottom:'var(--space-4)', fontSize:'var(--text-base)' }}>Hỗ trợ</h4>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              {['Câu hỏi thường gặp', 'Chính sách hoàn hủy', 'Điều khoản sử dụng', 'Chính sách bảo mật'].map(item => (
                <li key={item}>
                  <a href="#" style={{ fontSize:'var(--text-sm)', color:'rgba(255,255,255,0.65)' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 style={{ color:'#fff', marginBottom:'var(--space-4)', fontSize:'var(--text-base)' }}>Liên hệ</h4>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              {[
                { Icon: FiMapPin, text: '123 Nguyễn Huệ, Q.1, TP.HCM' },
                { Icon: FiPhone,  text: '1800 1234' },
                { Icon: FiMail,   text: 'hello@travelbook.vn' },
              ].map(({ Icon, text }) => (
                <li key={text} style={{ display:'flex', alignItems:'flex-start', gap:'var(--space-2)', fontSize:'var(--text-sm)', color:'rgba(255,255,255,0.65)' }}>
                  <Icon size={14} style={{ marginTop:3, flexShrink:0 }} />{text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'var(--space-6)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'var(--space-4)' }}>
          <p style={{ fontSize:'var(--text-sm)' }}>© {new Date().getFullYear()} TravelBook. All rights reserved.</p>
          <p style={{ fontSize:'var(--text-sm)' }}>Made with ❤️ in Vietnam</p>
        </div>
      </div>
    </footer>
  );
}
