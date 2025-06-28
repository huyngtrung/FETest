'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <div className={styles.logoCircle1}></div>
            <div className={styles.logoCircle2}></div>
          </div>
        </Link>

        <button
          className={styles.barIcon}
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={`${styles.nav} ${showMenu ? styles.navMobileActive : ''}`}
        >
          <div className={styles.navItems}>
            <Link href="#" className={styles.navLink}>
              About
            </Link>
            <Link href="#" className={styles.navLink}>
              Help
            </Link>
            <Link href="#" className={styles.navLink}>
              Features
            </Link>
          </div>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>
                👋 <strong>{user?.name}</strong>
              </span>
              <Link href="/profile" className={styles.loginBtn}>
                <button>Profile</button>
              </Link>
              <button onClick={logout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/signin">
              <button className={styles.signInBtn}>Sign Up</button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
