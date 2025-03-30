import { createContext, useContext, useMemo, useState } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);


  // Use promises
  const login = async (data) => {
    return new Promise((resolve, reject) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      resolve();
    });
  }

  // const signup = async (data) => {

  // }

  const logout = async (data) => {
    setUser(null);
    localStorage.setItem('user', JSON.stringify(null));
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

const userData = {
  name: "User1",
  questionnaire: "",
  sleepData: null
}