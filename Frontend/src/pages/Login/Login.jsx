import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Login.module.css';
import { useAuth } from '../../auth/UserAuth';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log in');
      }

      // Use the login function from UserAuth
      await login(data);
      
      // Redirect to questionnaire page
      navigate('/questionnaire');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      {/* Moon Icon */}
      <div className={style.moon}>🌙</div>

      {/* Login Card */}
      <div className={style.card}>
        <h1 className={style.title}>Welcome Back</h1>
        <p className={style.subtitle}>Log in to track your sleep patterns</p>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            value={formData.username}
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
          {error && <div className={style.error}>{error}</div>}
          <button type="submit" className={style.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className={style.signupLink}>
          Don't have an account?{" "}
          <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
}
