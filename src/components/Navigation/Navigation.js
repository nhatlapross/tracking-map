'use client';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useMediaQuery } from 'react-responsive';
import logo from "../../assets/Logo.png";

function Navigation() {
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem('user');
      navigate('/login');
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  };

  return (
    <nav className={isMobile ? 'mobile-nav' : 'desktop-nav'}>
      <div style={styles.navContent}>
        <img src={logo} alt="Location" style={{width: '100%', maxWidth: '200px',maxHeight:'200px'}} />
        <ul style={styles.navLinks}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.link}>Trang chủ</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/detail" style={styles.link}>Chi tiết</Link>
          </li>
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>Đăng xuất</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#1877f2',
    padding: '10px 20px',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#1877f2',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    justifyContent: 'center',
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginRight: '20px',
  },
  link: {
    color: '#1877f2',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  linkHover: {
    color: '#ffeb3b', // Change this to your desired hover color
  },
  logoutButton: {
    backgroundColor: 'white',
    color: '#1877f2',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navigation;