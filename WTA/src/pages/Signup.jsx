import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaBuilding, FaPhone } from 'react-icons/fa';
import styles from './Auth.module.css';
import request from '../../api/request';  
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate(); // for navigation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
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
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      };

      const response = await request({
        method: 'post',
        url: '/auth/signup',
        data: payload,
      });

      console.log('Signup successful:', response);
      toast.success('Signup successful! Redirecting to login...', {
        autoClose: 2000
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Signup failed:', error);
      toast.error(error?.response?.data?.error || 'Signup failed!');
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
    Role
  </label>
  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    className={styles.formInput}
    required
  >
    <option value="">Select Role</option>
    <option value="HR">HR</option>
    <option value="Supervisor">Supervisor</option>
    <option value="Manager">Manager</option>
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
      <ToastContainer position="top-center" />

    </div>
  );
};

export default Signup;