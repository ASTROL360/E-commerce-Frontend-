export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl text-danger mb-3">&#9888;</div>
      <p className="text-gray-600 text-sm mb-4">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button
          className="bg-primary text-white px-5 py-2 text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
