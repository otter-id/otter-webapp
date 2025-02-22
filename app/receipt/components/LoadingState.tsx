export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-4 px-4 max-w-md mx-auto flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        <p className="text-pink-600">Loading receipt...</p>
      </div>
    </div>
  );
}
