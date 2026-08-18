import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-7xl sm:text-8xl font-bold text-primary mb-2">404</h1>
      <p className="text-xl text-gray-500 mb-8">Page Not Found</p>
      <Link
        to="/"
        className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
