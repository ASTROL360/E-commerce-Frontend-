import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../../components/common/Avatar';

export default function Profile() {
  const { user } = useAuth();

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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Info</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
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
