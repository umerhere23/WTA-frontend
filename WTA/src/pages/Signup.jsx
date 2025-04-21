import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaBuilding, FaPhone } from 'react-icons/fa';
import styles from './Auth.module.css';
import request from '../../api/request';  
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.department,
        password: formData.password,
      };

      const response = await request({
        method: 'post',
        url: '/auth/signup',  
        data: payload,
      });

      console.log('Signup successful:', response);
     } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2 className={styles.authTitle}>Create Account</h2>
          <p className={styles.authSubtitle}>Register for NFM Worker Tracker access</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FaUser className={styles.inputIcon} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="Enter your full name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FaEnvelope className={styles.inputIcon} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FaPhone className={styles.inputIcon} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter your phone number"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FaBuilding className={styles.inputIcon} />
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={styles.formInput}
              required
            >
              <option value="">Select Department</option>
              <option value="HR">Human Resources</option>
              <option value="Operations">Operations</option>
              <option value="Milling">Milling</option>
              <option value="Packaging">Packaging</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FaLock className={styles.inputIcon} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="Create a password"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FaLock className={styles.inputIcon} />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className={styles.authButton}>
            Sign Up
          </button>

          <div className={styles.authFooter}>
            <p>
              Already have an account?{' '}
              <Link to="/login" className={styles.authLink}>
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;