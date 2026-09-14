import { Car } from "lucide-react";
import { cx } from "./ui";

/**
 * The WeShare wordmark: "We" in the blue→purple gradient and "Share" in ink,
 * matching the SwiftUI logo and the app icon.
 */
export function Wordmark({
  className,
  withIcon = false,
}: {
  className?: string;
  withIcon?: boolean;
}) {
  return (
    <span className={cx("inline-flex items-center gap-2 font-extrabold tracking-tight", className)}>
      <span>
        <span className="wordmark-we">We</span>
        <span className="text-ink">Share</span>
      </span>
      {withIcon && <Car className="size-[1em] text-ink" strokeWidth={2.5} />}
    </span>
  );
}
