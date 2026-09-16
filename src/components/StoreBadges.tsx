import { APP_STORE_URL } from "./Footer";

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12 3.84 21.85C3.34 21.6 3 21.09 3 20.5m13.81-5.38L6.05 21.34 14.54 12.85zM20.16 10.81c.34.27.59.69.59 1.19s-.25.92-.59 1.19l-2.27 1.31L15.39 12l2.5-2.5zM6.05 2.66l10.76 6.22-2.27 2.27z" />
    </svg>
  );
}

const badge =
  "inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 text-base font-semibold transition";

export function AppStoreButton({ className }: { className?: string }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${badge} bg-black text-white hover:bg-neutral-800 ${className ?? ""}`}
    >
      <AppleGlyph className="size-6" />
      App Store
    </a>
  );
}

/** Android isn't shipped yet, so this is deliberately inert. */
export function GooglePlayButton({ className }: { className?: string }) {
  return (
    <span
      className={`${badge} cursor-default bg-neutral-700 text-white/90 ${className ?? ""}`}
      title="Coming soon"
    >
      <PlayGlyph className="size-6" />
      Google Play
      <span className="text-xs font-medium text-white/60">soon</span>
    </span>
  );
}
