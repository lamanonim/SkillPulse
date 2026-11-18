import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  // səhifə açılanda token hələ etibarlıdırmı, /auth/me ilə yoxlanılır
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  function saveSession(data) {
    localStorage.setItem('token', data.token);
    setLoggedOut(false);
    setUser(data.user);
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data);
  }

  async function register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    saveSession(res.data);
  }

  function logout() {
    localStorage.removeItem('token');
    setLoggedOut(true);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loggedOut, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
