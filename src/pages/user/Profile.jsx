import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import authService from '../../services/authService';
import { unwrap } from '../../services/api';
import Avatar from '../../components/common/Avatar';
import PasswordInput from '../../components/common/PasswordInput';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const handleUpdateProfile = async (data) => {
    setProfileError('');
    setProfileLoading(true);
    try {
      const res = await authService.updateProfile(data);
      const updated = unwrap(res) || data;
      const newUser = { ...user, name: updated.name || data.name };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setEditingProfile(false);
      toast.success('Profile updated');
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    setPasswordError('');
    setPasswordLoading(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setEditingPassword(false);
      passwordForm.reset();
      toast.success('Password changed');
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 mb-4">Please log in to view your profile here.</p>
        <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-5 mb-8">
        <Avatar user={user} size={96} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Personal Info</h2>
          {!editingProfile && (
            <button onClick={() => { setEditingProfile(true); setEditingPassword(false); profileForm.reset({ name: user.name, email: user.email }); }} className="text-sm text-primary hover:underline font-medium">Edit</button>
          )}
        </div>

        {editingProfile ? (
          <>
            {profileError && <p className="text-danger text-sm mb-3">{profileError}</p>}
            <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input {...profileForm.register('name')} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                  {profileForm.formState.errors.name && <p className="text-danger text-xs mt-1">{profileForm.formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input {...profileForm.register('email')} type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                  {profileForm.formState.errors.email && <p className="text-danger text-xs mt-1">{profileForm.formState.errors.email.message}</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={profileLoading} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditingProfile(false)} className="text-gray-600 hover:text-gray-900 px-5 py-2 text-sm">Cancel</button>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          {!editingPassword && (
            <button onClick={() => { setEditingPassword(true); setEditingProfile(false); passwordForm.reset(); }} className="text-sm text-primary hover:underline font-medium">Change</button>
          )}
        </div>

        {editingPassword ? (
          <>
            {passwordError && <p className="text-danger text-sm mb-3">{passwordError}</p>}
            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
              <div className="space-y-3">
                <PasswordInput control={passwordForm.control} name="currentPassword" label="Current Password" />
                {passwordForm.formState.errors.currentPassword && <p className="text-danger text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>}
                <PasswordInput control={passwordForm.control} name="newPassword" label="New Password" />
                {passwordForm.formState.errors.newPassword && <p className="text-danger text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
                <PasswordInput control={passwordForm.control} name="confirmPassword" label="Confirm New Password" />
                {passwordForm.formState.errors.confirmPassword && <p className="text-danger text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>}
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={passwordLoading} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button type="button" onClick={() => setEditingPassword(false)} className="text-gray-600 hover:text-gray-900 px-5 py-2 text-sm">Cancel</button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/orders" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow block">
          <h3 className="font-semibold text-gray-900 mb-1">My Orders</h3>
          <p className="text-sm text-gray-500">Click here to view all the orders you've placed</p>
        </Link>
        <Link to="/addresses" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow block">
          <h3 className="font-semibold text-gray-900 mb-1">My Addresses</h3>
          <p className="text-sm text-gray-500">Manage shipping addresses</p>
        </Link>
      </div>
    </div>
  );
}
