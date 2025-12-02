export function LoadingState() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-4">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-pink-600 border-b-2"></div>
        <p className="text-pink-600">Loading receipt...</p>
      </div>
    </div>
  );
}
