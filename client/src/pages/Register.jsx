import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/client';

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  // Yeni qeydiyyatdan keçən testə, artıq daxil olmuş istifadəçi kabinetə gedir
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
    <div className="container auth-page">
      <form className="card auth-card" onSubmit={onSubmit} noValidate>
        <h2>Qeydiyyat</h2>
        <p className="muted">Hesab yarat və bacarıqlarını ölçməyə başla.</p>

        {message && <div className="alert">{message}</div>}

        <label htmlFor="name">Ad</label>
        <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Adın" required />
        {errors.name && <small className="field-error">{errors.name}</small>}

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="ad@mail.com" required />
        {errors.email && <small className="field-error">{errors.email}</small>}

        <label htmlFor="password">Şifrə</label>
        <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Ən azı 6 simvol" required />
        {errors.password && <small className="field-error">{errors.password}</small>}

        <button className="btn btn-primary btn-block" disabled={sending}>
          {sending ? 'Gözləyin...' : 'Qeydiyyatdan keç'}
        </button>
        <p className="muted center">
          Artıq hesabın var? <Link to="/login">Daxil ol</Link>
        </p>
      </form>
    </div>
  );
}
