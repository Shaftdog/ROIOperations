"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="max-w-md text-sm text-slate-500">We encountered an unexpected error while loading the order management workspace.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm"
      >
        Try again
      </button>
    </div>
  );
}
