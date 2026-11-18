import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/client';
import Icon from '../components/Icons';

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  if (user) return <Navigate to={justRegistered ? '/directions' : '/dashboard'} replace />;

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setMessage('');
    setJustRegistered(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setJustRegistered(false);
      setMessage(errorMessage(err));
      setErrors(err.response?.data?.errors || {});
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={onSubmit} noValidate>
        <h1>Hesab yarat</h1>
        <p>Bacarıqlarını ölç və fərdi inkişaf planını al. Pulsuzdur.</p>

        {message && <div className="alert">{message}</div>}

        <div className="field">
          <label htmlFor="name">Ad</label>
          <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Adın" autoComplete="name" required />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="ad@mail.com" autoComplete="email" required />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </div>

        <div className="field">
          <label htmlFor="password">Şifrə</label>
          <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Ən azı 6 simvol" autoComplete="new-password" required />
          {errors.password && <small className="field-error">{errors.password}</small>}
        </div>

        <button className="btn btn-primary btn-lg btn-block" disabled={sending}>
          {sending ? 'Gözləyin...' : <>Qeydiyyatdan keç <Icon name="arrow" size={18} /></>}
        </button>
        <p className="auth-switch">
          Artıq hesabın var? <Link to="/login">Daxil ol</Link>
        </p>
      </form>
    </div>
  );
}
