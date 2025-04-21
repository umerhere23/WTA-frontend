import React from 'react';
import styles from './Footer.module.css';
import { 
  FaHome, 
  FaChartLine, 
  FaFileAlt, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaBuilding,
  FaClock,
  FaUserTie
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.logoContainer}>
              <FaBuilding className={styles.logoIcon} />
              <h3 className={styles.footerHeading}>NFM Worker Tracker</h3>
            </div>
            <p className={styles.footerText}>
              Streamlining casual worker management for National Flour Mills Limited
            </p>
            <div className={styles.companyInfo}>
              <p className={styles.footerText}>
                <FaClock className={styles.icon} /> 
                Mon-Fri: 8:00 AM - 4:30 PM
              </p>
              <p className={styles.footerText}>
                <FaUserTie className={styles.icon} /> 
                HR Department
              </p>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>
                <FaHome className={styles.linkIcon} />
                <a href="/" className={styles.footerLink}>Home</a>
              </li>
              <li>
                <FaChartLine className={styles.linkIcon} />
                <a href="/dashboard" className={styles.footerLink}>Dashboard</a>
              </li>
              <li>
                <FaFileAlt className={styles.linkIcon} />
                <a href="/reports" className={styles.footerLink}>Reports</a>
              </li>
              <li>
                <FaEnvelope className={styles.linkIcon} />
                <a href="/contact" className={styles.footerLink}>Contact</a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>Contact Us</h3>
            <div className={styles.contactInfo}>
              <p className={styles.footerText}>
                <FaMapMarkerAlt className={styles.icon} /> 
                <span>Port of Spain, Trinidad</span>
              </p>
              <p className={styles.footerText}>
                <FaPhone className={styles.icon} /> 
                <span>(868) 123-4567</span>
              </p>
              <p className={styles.footerText}>
                <FaEnvelope className={styles.icon} /> 
                <span>hr@nationalflourmills.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} National Flour Mills Limited. All rights reserved.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className={styles.socialLink} aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;