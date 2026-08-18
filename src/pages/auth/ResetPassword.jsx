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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Password Reset</h1>
          <p className="text-gray-600 text-sm mb-4">Your password has been successfully reset.</p>
          <Link to="/login" className="block text-center text-primary font-semibold hover:underline text-sm">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h1>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        {email && <p className="text-gray-600 text-sm mb-4">Resetting for: <strong>{email}</strong></p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit PIN</label>
            <input
              type="text"
              {...register('pin')}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all tracking-[0.5em] text-center font-mono"
            />
            {errors.pin && <p className="text-danger text-sm mt-1">{errors.pin.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              {...register('newPassword')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            {errors.newPassword && <p className="text-danger text-sm mt-1">{errors.newPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            {errors.confirmPassword && <p className="text-danger text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="text-sm text-center mt-4 text-gray-600">
            <Link to="/forgot-password" className="text-primary font-semibold hover:underline">&larr; Get new PIN</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
