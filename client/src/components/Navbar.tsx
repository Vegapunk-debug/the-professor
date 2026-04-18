'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Upload", href: "/upload" },
  { label: "Chat", href: "/chat" },
  { label: "Visualize", href: "/visualize" },
  { label: "Quiz", href: "/quiz" },
  { label: "Flashcards", href: "/flashcards" },
];

const Navbar = () => {
  const pathName = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full fixed top-0 z-50 px-4 pt-4">
      <div className="max-w-6xl mx-auto">
        <nav className="bento-card-static !p-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 pl-2 group">
            <span className="text-xl font-black tracking-tight">
              THE<br className="hidden sm:block" />
              <span className="text-primary">PROF</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map(({ label, href }) => {
              const isActive =
                pathName === href ||
                (href !== "/" && pathName.startsWith(href));
              return (
                <Link
                  href={href}
                  key={label}
                  className={`px-5 py-2 rounded-full text-sm font-bold border-2 border-foreground transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
                      : "bg-card text-foreground hover:bg-primary hover:shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-0.5"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-xs font-bold text-muted-foreground px-2">
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="btn-primary text-sm !bg-[var(--bg-pink)] flex items-center gap-1.5"
                  id="logout-btn"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="btn-primary text-sm"
              >
                Sign In →
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-xl border-2 border-foreground bg-card hover:bg-primary transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-2 bento-card-static !p-3 origin-top md:hidden"
            >
              <div className="flex flex-col gap-1.5">
                {navItems.map(({ label, href }) => {
                  const isActive =
                    pathName === href ||
                    (href !== "/" && pathName.startsWith(href));
                  return (
                    <Link
                      href={href}
                      key={label}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold border-2 border-foreground transition-all text-center ${
                        isActive
                          ? "bg-primary"
                          : "bg-card hover:bg-primary"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="btn-primary w-full justify-center mt-1 !bg-[var(--bg-pink)] flex items-center gap-1.5"
                  >
                    <LogOut size={14} />
                    Logout ({user?.name?.split(' ')[0]})
                  </button>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full justify-center mt-1"
                  >
                    Sign In →
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;