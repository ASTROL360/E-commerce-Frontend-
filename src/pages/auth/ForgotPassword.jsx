import { useState } from 'react';
import { Link } from 'react-router-dom';

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
      // await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={containerStyle}>
        <div style={formCardStyle}>
          <h1>Check Your Email</h1>
          <p>If an account exists with <strong>{email}</strong>, we have sent a password reset link.</p>
          <Link to="/login" style={{ color: '#667eea' }}>&larr; Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h1>Forgot Password</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Enter your email address and we'll send you a link to reset your password.</p>
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
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
