import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={containerStyle}>
        <div style={formCardStyle}>
          <h1>Check Your Email</h1>
          <div style={iconContainerStyle}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4l-10 8L2 4" />
            </svg>
          </div>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '0.5rem' }}>
            If an account exists with <strong>{email}</strong>, we have sent a 6-digit PIN to that email address.
          </p>
          <p style={{ color: '#999', fontSize: '0.85rem', textAlign: 'center' }}>
            The PIN expires in 5 minutes.
          </p>
          <Link to={`/reset-password?email=${encodeURIComponent(email)}`} style={{
            display: 'block', textAlign: 'center', marginTop: '1.5rem',
            color: '#667eea', fontWeight: 600
          }}>
            Enter PIN &rarr;
          </Link>
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
              Wrong email? Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h1>Forgot Password</h1>
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        <p style={{ marginBottom: '1rem', color: '#666' }}>Enter your email and we'll send you a 6-digit PIN to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Sending...' : 'Send PIN'}
          </button>
        </form>
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#667eea' }}>&larr; Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' };
const formCardStyle = { width: '100%', maxWidth: 420, padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const fieldStyle = { marginBottom: '1rem' };
const inputStyle = { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', marginTop: '0.25rem', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '0.75rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 };
const iconContainerStyle = { textAlign: 'center', margin: '1rem 0' };
