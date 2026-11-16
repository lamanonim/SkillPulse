// İstifadəçinin login vəziyyəti bütün səhifələr üçün buradadır
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // tətbiq açılanda token yoxlanılır

  // Tətbiq açılanda: token varsa /auth/me ilə yoxla
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  function saveSession(data) {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data);
  }

  async function register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    saveSession(res.data); // qeydiyyatdan sonra avtomatik daxil olur
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
