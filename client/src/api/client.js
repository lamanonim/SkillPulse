// Backend ilə bütün əlaqə buradan keçir (FRONTEND_API.md, bölmə 3)
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Hər sorğuya token əlavə olunur
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Qorunan route-da 401 gəlsə: tokeni sil, login səhifəsinə yönləndir
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isAuthForm = url.includes('/auth/login') || url.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthForm) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Xətadan istifadəçiyə göstəriləcək mesajı çıxarır
export function errorMessage(err) {
  if (!err.response) return 'Serverə qoşulmaq mümkün olmadı. İnterneti və ya serveri yoxlayın.';
  return err.response.data?.message || 'Gözlənilməz xəta baş verdi.';
}

export default api;
