import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import authService from '../../services/authService';

const schema = z.object({
  pin: z.string().min(4, 'PIN must be at least 4 digits').regex(/^\d+$/, 'PIN must contain only digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(data.pin, data.newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Password Reset</h1>
          <p>Your password has been successfully reset.</p>
          <Link to="/login" className="auth-link-center">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>
        {error && <p className="auth-error-global">{error}</p>}
        {email && <p className="auth-description">Resetting for: <strong>{email}</strong></p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label>6-Digit PIN</label>
            <input
              type="text"
              {...register('pin')}
              placeholder="000000"
              maxLength={6}
              className="auth-input auth-pin-input"
            />
            {errors.pin && <p className="auth-error">{errors.pin.message}</p>}
          </div>

          <div className="auth-field">
            <label>New Password</label>
            <input
              type="password"
              {...register('newPassword')}
              className="auth-input"
            />
            {errors.newPassword && <p className="auth-error">{errors.newPassword.message}</p>}
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="auth-input"
            />
            {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="auth-link">
            <Link to="/forgot-password" className="auth-back-link">&larr; Get new PIN</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
