import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Auth.module.css';
import request from '../../api/request.jsx';
import { loginSuccess } from '../store/authSlice.js';
import { ToastContainer } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const { data } = await request({
        method: 'post',
        url: '/auth/login',
        data: { email, password },
      });
  
      const { user, token } = data;
  
      dispatch(loginSuccess({ user, token }));
  
      toast.success('Login successful! Redirecting...', {
        position: 'top-right',
        autoClose: 2000,
      });
  
       setTimeout(() => {
        if (user.role === 'HR') {
          navigate('/hr/hr');
        } else if (user.role === 'supervisor') {
          navigate('/supervisor/dashboard');
        } else if (user.role === 'manager') {
          navigate('/manager/dashboard');
        } else {
          navigate('/');  
        }
      }, 2000);
  
    } catch (err) {
      console.error('Login Failed:', err);
  
      toast.error(
        err?.response?.data?.message || 'Login failed. Please try again.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2 className={styles.authTitle}>Welcome Back</h2>
          <p className={styles.authSubtitle}>Log in to your NFM Worker Tracker account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FaEnvelope className={styles.inputIcon} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.formInput}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              <FaLock className={styles.inputIcon} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formInput}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formOptions}>
            <div className={styles.rememberMe}>
              <input 
                type="checkbox" 
                id="remember" 
                className={styles.checkbox} 
                disabled={isLoading}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className={styles.authFooter}>
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className={styles.authLink}>
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />

    </div>
  );
};

export default Login;