import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import authService from '../../services/authService';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
});

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Check Your Email</h1>
          <div className="auth-icon-container">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4l-10 8L2 4" />
            </svg>
          </div>
          <p className="auth-hint">
            If an account exists with <strong>{submittedEmail}</strong>, we have sent a 6-digit PIN to that email address.
          </p>
          <p className="auth-hint-sub">
            The PIN expires in 5 minutes.
          </p>
          <Link to={`/reset-password?email=${encodeURIComponent(submittedEmail)}`} className="auth-link-center">
            Enter PIN &rarr;
          </Link>
          <div className="auth-link">
            <button onClick={() => setSubmitted(false)} className="auth-try-again">
              Wrong email? Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        {error && <p className="auth-error-global">{error}</p>}
        <p className="auth-description">Enter your email and we'll send you a 6-digit PIN to reset your password.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              {...register('email')}
              className="auth-input"
            />
            {errors.email && <p className="auth-error">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Sending...' : 'Send PIN'}
          </button>
        </form>
        <div className="auth-link">
          <Link to="/login" className="auth-back-link">&larr; Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
