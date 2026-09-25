import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "border border-brand-200 text-brand-700 hover:bg-brand-50",
  dark: "bg-ink text-white hover:bg-neutral-800",
  ghost: "text-ink-soft hover:bg-neutral-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
} as const;

export type ButtonVariant = keyof typeof variants;

export function Button({
  variant = "primary",
  loading = false,
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; loading?: boolean }) {
  return (
    <button
      className={cx(buttonBase, variants[variant], className)}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link className={cx(buttonBase, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-xl border border-neutral-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** The app's grouped-content block: soft gray fill, 12px radius, no border. */
export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("rounded-xl bg-neutral-100 p-4", className)}>
      {children}
    </div>
  );
}

export function Badge({
  tone = "brand",
  children,
  className,
}: {
  tone?: "brand" | "yellow" | "green" | "red" | "neutral";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-100 text-brand-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    neutral: "bg-neutral-100 text-ink-soft",
  } as const;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-muted uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-neutral-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100";

export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "info" | "success" | "warning";
  children: ReactNode;
}) {
  const tones = {
    error: "bg-red-50 text-red-700 border-red-100",
    info: "bg-brand-50 text-brand-700 border-brand-100",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  } as const;
  return (
    <div
      className={cx(
        "rounded-xl border px-4 py-3 text-sm font-medium",
        tones[tone],
      )}
    >
      {children}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-ink-muted">
      <Loader2 className="size-4 animate-spin" />
      {label ?? "Loading…"}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-200 px-6 py-14 text-center">
      <div className="text-neutral-300">{icon}</div>
      <p className="font-semibold text-ink">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {action}
    </div>
  );
}

export function Avatar({
  name,
  imageUrl,
  size = 40,
}: {
  name: string;
  imageUrl?: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (imageUrl) {
    return (
      // Profile photos come from Firebase Storage; next/image would need remote patterns.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials || "?"}
    </span>
  );
}
