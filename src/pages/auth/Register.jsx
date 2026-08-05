import { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ErrorMessage from '../../components/common/ErrorMessage';
import PasswordInput from '../../components/common/PasswordInput';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || location.state?.from || '/';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate(returnUrl);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate(returnUrl);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h1>Create Account</h1>
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
          </div>
          <PasswordInput
            label="Password"
            value={form.password}
            onChange={(e) => handleChange(e)}
            name="password"
            required
          />
          <PasswordInput
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => handleChange(e)}
            name="confirmPassword"
            required
          />
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={dividerStyle}>
          <hr style={hrStyle} />
          <span style={dividerTextStyle}>or</span>
          <hr style={hrStyle} />
        </div>

        <button type="button" onClick={handleGoogleRegister} disabled={googleLoading} style={googleBtnStyle}>
          <GoogleIcon />
          <span>{googleLoading ? 'Signing in...' : 'Sign up with Google'}</span>
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} style={{ fontWeight: 600 }}>Login</Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' };
const formCardStyle = { width: '100%', maxWidth: 420, padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const fieldStyle = { marginBottom: '1rem' };
const inputStyle = { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', marginTop: '0.25rem', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '0.75rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 };
const googleBtnStyle = { width: '100%', padding: '0.65rem 1rem', background: '#fff', color: '#444', border: '1px solid #dadce0', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', transition: 'background 0.2s, box-shadow 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' };
const dividerStyle = { display: 'flex', alignItems: 'center', margin: '1.25rem 0' };
const hrStyle = { flex: 1, border: 'none', borderTop: '1px solid #e0e0e0' };
const dividerTextStyle = { padding: '0 0.85rem', color: '#999', fontSize: '0.85rem' };
