import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Casual Worker Engagement Tracker</h1>
          <p className={styles.subtitle}>Streamlining temporary workforce management for National Flour Mills Limited</p>
          <div className={styles.ctaButtons}>
            <button className={`${styles.button} ${styles.primary}`}>Get Started</button>
            <button className={`${styles.button} ${styles.secondary}`}>Learn More</button>
          </div>
        </div>
      </header>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Key Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📋</div>
            <h3>Engagement Management</h3>
            <p>Add, edit, and view employee engagement records with department and job title tracking.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔔</div>
            <h3>Automated Alerts</h3>
            <p>Daily notifications at 75, 80, 85, and 90 days to prevent over-retention.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Reporting Dashboard</h3>
            <p>Comprehensive views and exports of all current and historical engagements.</p>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>3</span>
          <span className={styles.statLabel}>Month Limit</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>4</span>
          <span className={styles.statLabel}>Alert Stages</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>24/7</span>
          <span className={styles.statLabel}>Monitoring</span>
        </div>
      </section>

      <section className={styles.demo}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <p>HR creates a new casual worker engagement</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <p>System tracks duration in department/job title</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <p>Automated alerts sent to relevant parties</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <p>Engagement ends before 3-month limit</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;