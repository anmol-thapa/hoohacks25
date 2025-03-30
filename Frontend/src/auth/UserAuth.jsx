import { createContext, useContext, useMemo, useState } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = async (data) => {
    return new Promise((resolve, reject) => {
      const userData = {
        id: data.user_id,
        questionnaire: null,
        sleepData: null
      }
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      resolve();
    });
  }

  // const signup = async (data) => {

  // }

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  }

  const data = useMemo(() => ({
    user,
    login,
    // signup,
    logout
  }), [user]);

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext);
}