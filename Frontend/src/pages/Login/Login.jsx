import { useAuth } from "../../auth/UserAuth";
import { useNavigate } from "react-router";
import styles from "./Login.module.css";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(username).then(() => navigate('/'));
  };

  return (
    <div className={styles.container}>
      {/* Moon Icon */}
      <div className={styles.moon}>🌙</div>

      {/* Login Card */}
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Log in to your sleep-optimized dashboard</p>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <input type="text" onChange={e => setUsername(e.target.value)} placeholder="Username" className={styles.input} />
          <input type="password" placeholder="Password" className={styles.input} />
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}
