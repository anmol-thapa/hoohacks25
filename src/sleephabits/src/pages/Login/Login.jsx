import { useAuth } from "../../auth/UserAuth";
import { useNavigate } from "react-router";
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    await login()
      .then(() => navigate('/'));
  }
  return (
    <>
      <input type='text' placeholder='Username' />
      <input type='password' placeholder='Password' />
      <button onClick={handleLogin}>
        Login
      </button>
    </>
  )
}