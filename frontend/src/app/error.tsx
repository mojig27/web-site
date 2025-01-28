// src/app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">مشکلی پیش آمده!</h2>
      <button
        className="bg-primary-600 text-white px-4 py-2 rounded-md"
        onClick={() => reset()}
      >
        تلاش مجدد
      </button>
    </div>
  )
}