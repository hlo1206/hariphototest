import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Instagram, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/portraits", label: "Portraits" },
  { href: "/landscapes", label: "Landscapes" },
  { href: "/street", label: "Street" },
  { href: "/cultural", label: "Cultural" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-transparent transition-colors duration-300">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
          <Link href="/" className="group">
            <span className="font-serif text-2xl tracking-tight text-foreground transition-colors group-hover:text-primary">
              Frames by Hari
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide uppercase transition-colors hover:text-primary ${
                    isActive ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 20 }}
              className="fixed inset-y-0 right-0 z-50 w-[80%] max-w-sm bg-background border-l border-border p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-end mb-12">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-serif text-3xl tracking-tight text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-background border-t border-border mt-auto">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div>
              <Link href="/">
                <span className="font-serif text-2xl tracking-tight text-foreground hover:text-primary transition-colors inline-block mb-4">
                  Frames by Hari
                </span>
              </Link>
              <p className="text-muted-foreground max-w-xs font-light">
                Honest, expressive, and timeless imagery by Hariharakrishnan Sriram.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-lg">Contact</h3>
              <a
                href="https://wa.me/917977206423"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                <Phone className="w-4 h-4" />
                <span>+91 79772 06423</span>
              </a>
              <a
                href="https://www.instagram.com/frames_by_hari_/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                <Instagram className="w-4 h-4" />
                <span>@frames_by_hari_</span>
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-lg">Explore</h3>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-light">
            <p>© 2026 Hariharakrishnan Sriram</p>
            <p>Pune, Maharashtra, India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
