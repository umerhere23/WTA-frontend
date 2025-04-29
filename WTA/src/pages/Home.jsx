import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';

const Home = () => {

  const [stats, setStats] = useState([
    { id: 1, value: 0, target: 187, label: "Active Engagements" },
    { id: 2, value: 0, target: 3, label: "Month Limit" },
    { id: 3, value: 0, target: 4, label: "Alert Stages" },
    { id: 4, value: 0, target: 24, label: "/7 Monitoring" }
  ]);

   const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
     setStats([
      { id: 1, value: 0, target: getRandomValue(150, 250), label: "Active Engagements" },
      { id: 2, value: 0, target: 3, label: "Month Limit" },
      { id: 3, value: 0, target: 4, label: "Alert Stages" },
      { id: 4, value: 0, target: 24, label: "/7 Monitoring" }
    ]);

     const animateCounters = () => {
      const duration = 2000;  
      const startTime = performance.now();

      const updateCounters = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        setStats(prevStats => 
          prevStats.map(stat => ({
            ...stat,
            value: Math.floor(progress * stat.target)
          }))
        );

        if (progress < 1) {
          requestAnimationFrame(updateCounters);
        }
      };

      requestAnimationFrame(updateCounters);
    };

     const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector(`.${styles.stats}`);
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection);
      }
    };
  }, []);
  return (
    <div className={styles.container}>
       <header className={styles.hero} style={{padding:"10px"}}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.titleHighlight}>Optimize</span> Your Casual Workforce Management
          </h1>
          <p className={styles.subtitle}>
            National Flour Mills Limited's solution for streamlined temporary worker engagement tracking
          </p>
          <div className={styles.ctaButtons}>
            <button className={`${styles.button} ${styles.primary}`}>
              Get Started <span className={styles.buttonArrow}>→</span>
            </button>
            <button className={`${styles.button} ${styles.secondary}`}>
              Watch Demo <span className={styles.playIcon}>▶</span>
            </button>
          </div>
        </div>
        <div className={styles.heroIllustration}>
          <div className={styles.circle}></div>
          <div className={styles.triangle}></div>
          <div className={styles.workerIllustration}></div>
        </div>
      </header>

      {/* Trust badges */}
      <div className={styles.trustBadges}>
        <div className={styles.badge}>✓ Trusted by HR Professionals</div>
        <div className={styles.badge}>✓ Secure Data Handling</div>
        <div className={styles.badge}>✓ 24/7 System Monitoring</div>
      </div>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Key Features</h2>
          <p className={styles.sectionSubtitle}>Everything you need for compliant casual worker management</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2zm0 2.8L18 10v9h-2v-6H8v6H6v-9l6-7.2z"/>
              </svg>
            </div>
            <h3>Engagement Tracking</h3>
            <p>Monitor worker engagements with department and job title details in real-time.</p>
            <div className={styles.featureLearnMore}>Learn more →</div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <h3>Automated Alerts</h3>
            <p>Smart notifications at 75, 80, 85, and 90 days to prevent compliance issues.</p>
            <div className={styles.featureLearnMore}>Learn more →</div>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <h3>Reporting Dashboard</h3>
            <p>Comprehensive analytics and export capabilities for all engagements.</p>
            <div className={styles.featureLearnMore}>Learn more →</div>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.id} className={styles.statItem}>
          <span className={styles.statNumber}>{stat.value}</span>
          <span className={styles.statLabel}>{stat.label}</span>
        </div>
      ))}
    </section>

      {/* How It Works Section */}
      <section className={styles.demo}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>Simple steps to compliant casual worker management</p>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Create Engagement</h3>
              <p>HR adds new casual worker with department and job details</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>System Tracking</h3>
              <p>Automated duration tracking begins immediately</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Smart Alerts</h3>
              <p>Relevant parties receive notifications at key intervals</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Timely Conclusion</h3>
              <p>Engagement ends before reaching the 3-month limit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className={styles.testimonial}>
        <div className={styles.testimonialContent}>
          <div className={styles.quoteIcon}>"</div>
          <blockquote>
            This system has transformed how we manage our casual workforce, ensuring compliance while saving countless hours of manual tracking.
          </blockquote>
          <div className={styles.testimonialAuthor}>
            <div className={styles.authorAvatar}></div>
            <div>
              <div className={styles.authorName}>HR Director</div>
              <div className={styles.authorTitle}>National Flour Mills Limited</div>
            </div>
          </div>
        </div>
      </section>

 
    </div>
  );
};

export default Home;