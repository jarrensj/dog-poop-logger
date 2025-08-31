'use client';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl w-full mx-4 sm:mx-0">
      <p className="font-noto font-light">{message}</p>
    </div>
  );
}
