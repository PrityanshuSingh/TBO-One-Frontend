// src/pages/Signup/Signup.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './styles/Signup.module.scss';

function Signup() {
  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await signUp(email, userName, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Sign up failed');
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.imageSection}>
        <img
          src="https://wallpapers.com/images/hd/travel-laptop-k9ptnpwieuhwy56q.jpg"
          alt="Explore Scenic"
          className={styles.signupImage}
        />
      </div>

      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Create an Account</h2>
          <p className={styles.subtitle}>Sign up to get started (TBO Credentials)</p>

          {errorMsg && <div className={styles.error}>{errorMsg}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </label>

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
              TBO Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </label>

            <button type="submit" className={styles.signupButton}>
              Sign Up
            </button>
          </form>

          <p className={styles.bottomText}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
