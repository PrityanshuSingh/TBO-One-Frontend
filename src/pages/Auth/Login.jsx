// src/pages/Login/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './styles/Login.module.scss';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login(userName, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.imageSection}>
        <img
          src="https://wallpapers.com/images/featured/travel-laptop-0m6r2w9ywrwtb81n.jpg"
          alt="Travel Scenic"
          className={styles.loginImage}
        />
      </div>

      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Login to continue (TBO Credentials)</p>

          {errorMsg && <div className={styles.error}>{errorMsg}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              TBO Username:
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </label>

            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>

          <p className={styles.bottomText}>
            No account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
