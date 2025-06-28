import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoContainer}>
                <div className={styles.logoCircle1}></div>
                <div className={styles.logoCircle2}></div>
              </div>
              DataWarehouse
            </div>
            <div className={styles.companyInfo}>
              <p>Warehouse Society, 234</p>
              <p>Bahagia Ave Street PRBW 29281</p>
            </div>
            <div className={styles.contact}>info@warehouse.project</div>
            <div className={styles.phone}>1-232-3434 (Main)</div>
          </div>

          <div className={styles.section}>
            <h3>About</h3>
            <ul>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <Link href="/features">Features</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/dw-news">DW News</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Help</h3>
            <ul>
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/sign-up">Sign up</Link>
              </li>
              <li>
                <Link href="/guide">Guide</Link>
              </li>
              <li>
                <Link href="/reports">Reports</Link>
              </li>
              <li>
                <Link href="/qa">Q&A</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Social Media</h3>
            <div className={styles.socialIcons}>
              <Link href="#" className={styles.socialIcon}>
                <div className={styles.iconFacebook}></div>
              </Link>
              <Link href="#" className={styles.socialIcon}>
                <div className={styles.iconTwitter}></div>
              </Link>
              <Link href="#" className={styles.socialIcon}>
                <div className={styles.iconInstagram}></div>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>© DataWarehouse™, 2020. All rights reserved.</p>
            <p>Company Registration Number: 21479524.</p>
          </div>
          <div className={styles.social}>
            <div className={styles.chatBubble}>
              <div className={styles.dots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
