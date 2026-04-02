import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--theme-background)]">
      <h2 className="text-3xl font-bold text-[var(--theme-text)] mb-4">Page Not Found</h2>
      <p className="text-[var(--theme-muted)] mb-8">Could not find requested resource</p>
      <Link 
        href="/"
        className="px-4 py-2 bg-[var(--theme-primary)] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
