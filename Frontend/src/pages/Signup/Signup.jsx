import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Signup.module.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate username format (alphanumeric, underscore, 3-20 characters)
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      setError('Username must be 3-20 characters long and can only contain letters, numbers, and underscores');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Username already exists') {
          setError('This username is already taken. Please choose another one.');
        } else if (data.error === 'Email already exists') {
          setError('This email is already registered. Please use a different email or log in.');
        } else {
          throw new Error(data.error || 'Failed to sign up');
        }
        setLoading(false);
        return;
      }

      // Redirect to login page
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.moon}>🌙</div>
      <div className={style.card}>
        <h1 className={style.title}>Create Account</h1>
        <p className={style.subtitle}>Join us to track your sleep patterns</p>
        
        {error && <div className={style.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={style.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={style.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={style.input}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={style.input}
            required
          />
          <button
            type="submit"
            className={style.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div className={style.loginLink}>
          Already have an account?{" "}
          <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
} 