import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/client';
import Icon from '../components/Icons';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setMessage('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setMessage(errorMessage(err));
      setErrors(err.response?.data?.errors || {});
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={onSubmit} noValidate>
        <h1>Xoş gəldin 👋</h1>
        <p>Hesabına daxil ol və irəliləyişini davam etdir.</p>

        {message && <div className="alert">{message}</div>}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="ad@mail.com" autoComplete="email" required />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </div>

        <div className="field">
          <label htmlFor="password">Şifrə</label>
          <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••" autoComplete="current-password" required />
          {errors.password && <small className="field-error">{errors.password}</small>}
        </div>

        <button className="btn btn-primary btn-lg btn-block" disabled={sending}>
          {sending ? 'Gözləyin...' : <>Daxil ol <Icon name="arrow" size={18} /></>}
        </button>
        <p className="auth-switch">
          Hesabın yoxdur? <Link to="/register">Qeydiyyatdan keç</Link>
        </p>
      </form>
    </div>
  );
}
