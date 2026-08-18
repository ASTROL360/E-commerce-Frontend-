export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-gray-500">{text}</p>
    </div>
  );
}
