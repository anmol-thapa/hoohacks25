import { createContext, useContext, useMemo, useState } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = async (data) => {
    return new Promise((resolve, reject) => {
      try {
        // Retrieve stored accounts
        let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

        if (!Array.isArray(accounts)) {
          accounts = [];
        }

        // Find user by username or email
        const foundUser = accounts.find(
          (user) => user.username === data.username || user.email === data.username
        );

        if (!foundUser) {
          return reject(new Error("User not found"));
        }

        // Validate password
        if (foundUser.password !== data.password) {
          return reject(new Error("Incorrect password"));
        }

        // User session data
        const userData = {
          id: foundUser.username, // Using username as user ID
          email: foundUser.email,
          questionnaire: foundUser.questionnaire || null,
          sleepData: foundUser.sleepData || null,
        };

        // Store logged-in user session in localStorage
        localStorage.setItem("currentUser", JSON.stringify(userData));

        // Update React state
        setUser(userData);

        // Debugging: Ensure user state updates
        console.log("User successfully logged in:", userData);

        resolve(userData);
      } catch (error) {
        reject(error);
      }
    });
  };



  const signup = async (data) => {
    return new Promise((resolve, reject) => {
      try {
        const userData = {
          email: data.email,
          password: data.password,
          username: data.username,
          questionnaire: null,
          sleepData: null,
        };

        // Retrieve existing accounts or initialize an empty array
        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

        // Ensure `accounts` is an array
        if (!Array.isArray(accounts)) {
          accounts = [];
        }

        // Add new user
        accounts.push(userData);

        // Store back in localStorage as a string
        localStorage.setItem('accounts', JSON.stringify(accounts));
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setUser(userData);

        resolve(userData); // Resolve with the created user
      } catch (error) {
        reject(error); // Handle errors
      }
    });
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  }

  const data = useMemo(() => ({
    user,
    login,
    signup,
    logout
  }), [user]);

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext);
}