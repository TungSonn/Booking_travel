import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiMapPin } from 'react-icons/fi';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Khách Sạn',    to: '/hotels' },
  { label: 'Tour Du Lịch', to: '/tours' },
  { label: 'Hướng Dẫn Viên', to: '/guides' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <FiMapPin className={styles.logoIcon} />
          <span>Travel<strong>Book</strong></span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.avatarBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.avatar
                  ? <img src={`/uploads/${user.avatar}`} alt={user.full_name} className={styles.avatar} />
                  : <span className={styles.avatarPlaceholder}>{user.full_name?.[0]}</span>
                }
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <p className={styles.dropdownName}>{user.full_name}</p>
                  <p className={styles.dropdownEmail}>{user.email}</p>
                  <hr className={styles.divider} />
                  <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <FiGrid /> Tổng quan
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      <FiGrid /> Quản trị
                    </Link>
                  )}
                  <button className={`${styles.dropdownItem} ${styles.logoutBtn}`} onClick={handleLogout}>
                    <FiLogOut /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
            </>
          )}

          {/* Mobile toggle */}
          <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className={styles.mobileAuth}>
              <Link to="/login"    className="btn btn-outline" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Đăng ký</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
