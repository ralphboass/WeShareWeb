"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Wordmark } from "./Wordmark";
import { Avatar, ButtonLink, cx } from "./ui";

const links = [
  { href: "/rides", label: "Find a ride", icon: Search },
  { href: "/rides/new", label: "Offer a ride", icon: Plus, authOnly: true },
  { href: "/bookings", label: "My trips", icon: CalendarCheck, authOnly: true },
  { href: "/messages", label: "Messages", icon: MessageCircle, authOnly: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { firebaseUser, profile, logOut } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const visibleLinks = links.filter((link) => !link.authOnly || firebaseUser);
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : (firebaseUser?.displayName ?? firebaseUser?.email ?? "Account");

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
        <Link href="/" className="text-xl">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cx(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-soft hover:bg-neutral-100 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {firebaseUser ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm font-medium text-ink-soft transition hover:bg-neutral-100"
              >
                <Avatar
                  name={displayName}
                  imageUrl={profile?.profileImageUrl}
                  size={32}
                />
                <span className="max-w-32 truncate">{displayName}</span>
              </Link>
              <button
                type="button"
                onClick={() => logOut()}
                className="rounded-lg p-2 text-ink-muted transition hover:bg-neutral-100 hover:text-ink"
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-neutral-100"
              >
                Log in
              </Link>
              <ButtonLink href="/signup" className="px-4 py-2">
                Sign up
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto rounded-lg p-2 text-ink-soft transition hover:bg-neutral-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-5 pt-2 pb-4 md:hidden">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ink-soft hover:bg-neutral-100"
            >
              <link.icon className="size-4 text-brand-600" />
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-neutral-100 pt-2">
            {firebaseUser ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ink-soft hover:bg-neutral-100"
                >
                  <User className="size-4 text-brand-600" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => logOut()}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex gap-3 px-3 pt-2">
                <ButtonLink href="/login" variant="secondary" className="flex-1">
                  Log in
                </ButtonLink>
                <ButtonLink href="/signup" className="flex-1">
                  Sign up
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
