'use client';

export default function LoadingSpinner() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-0 pb-4 sm:pb-6 flex flex-col items-center justify-center textured-bg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-green)] mx-auto mb-4"></div>
        <p className="text-lg text-lighter font-noto font-light">Loading your poop logs...</p>
      </div>
    </main>
  );
}
