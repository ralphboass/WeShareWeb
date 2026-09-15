"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import type { PlaceSuggestion } from "@/app/api/places/route";
import { cx } from "./ui";

/**
 * Typeahead over real geocoded places. Free text is still allowed so a search
 * can be typed quickly, but picking a suggestion gives a verified address in
 * the same format the iOS app stores.
 */
export function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  ariaLabel,
  pinClassName = "text-brand-600",
  inputClassName,
  wrapperClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: PlaceSuggestion) => void;
  placeholder?: string;
  ariaLabel?: string;
  pinClassName?: string;
  inputClassName?: string;
  wrapperClassName?: string;
}) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  // Set while applying a suggestion, so the resulting value change doesn't
  // immediately trigger another lookup.
  const justSelected = useRef(false);

  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }
    const term = value.trim();
    if (term.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/places?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { results?: PlaceSuggestion[] };
        setSuggestions(data.results ?? []);
        setHighlighted(-1);
        setOpen(true);
      } catch {
        // Aborted or offline — leave the previous suggestions in place.
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const apply = (place: PlaceSuggestion) => {
    justSelected.current = true;
    onChange(place.label);
    onSelect?.(place);
    setOpen(false);
    setSuggestions([]);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted(
        (index) => (index - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === "Enter" && highlighted >= 0) {
      event.preventDefault();
      apply(suggestions[highlighted]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cx("relative", wrapperClassName)}>
      <div className="flex items-center gap-2">
        <MapPin className={cx("size-4 shrink-0", pinClassName)} />
        <input
          className={
            inputClassName ??
            "w-full min-w-0 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-neutral-400"
          }
          placeholder={placeholder}
          aria-label={ariaLabel}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {loading && (
          <Loader2 className="size-3.5 shrink-0 animate-spin text-ink-muted" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-50 max-h-72 overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-xl"
        >
          {suggestions.map((place, index) => (
            <li key={place.id} role="option" aria-selected={index === highlighted}>
              <button
                type="button"
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => apply(place)}
                className={cx(
                  "flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition",
                  index === highlighted ? "bg-brand-50" : "hover:bg-neutral-50",
                )}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {place.label}
                  </span>
                  <span className="block truncate text-xs text-ink-muted">
                    {place.context}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
