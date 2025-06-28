'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.scss';
import Link from 'next/link';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid username');
      }
    } catch (err) {
      setError(`An error occurred. Please try again: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signin}>
      <Link href="/" className={styles.logo}>
        <div className={styles.logoContainer}>
          <div className={styles.logoCircle1}></div>
          <div className={styles.logoCircle2}></div>
        </div>
      </Link>

      <div className={styles.formContainer}>
        <h1 className={styles.title}>Sign In</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={error ? styles.error : ''}
              required
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
