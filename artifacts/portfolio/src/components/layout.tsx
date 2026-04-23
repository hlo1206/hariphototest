import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Instagram, Phone, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SubGroup = {
  href: string;
  label: string;
  items: { label: string; filter: string }[];
};

type NavLink = {
  href: string;
  label: string;
  groups?: SubGroup[];
};

const portraitGroups: SubGroup[] = [
  {
    href: "/street",
    label: "Street Photography",
    items: [
      { label: "Pune", filter: "Pune" },
      { label: "Talegaon", filter: "Talegaon" },
      { label: "Vadgaon", filter: "Vadgaon" },
    ],
  },
  {
    href: "/cultural",
    label: "Cultural Events",
    items: [
      { label: "Ganpati", filter: "Ganpati" },
      { label: "Gudi Padwa", filter: "Gudi Padwa" },
      { label: "Diwali", filter: "Diwali" },
    ],
  },
  {
    href: "/events",
    label: "Events",
    items: [
      { label: "Live Dance Show", filter: "Live Dance Show" },
      { label: "Wrestling", filter: "Wrestling" },
    ],
  },
];

const navLinks: NavLink[] = [
  { href: "/portraits", label: "Portraits", groups: portraitGroups },
  { href: "/landscapes", label: "Landscapes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

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
              const hasGroups = !!link.groups?.length;
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => hasGroups && setOpenDropdown(link.href)}
                  onMouseLeave={() => hasGroups && setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 text-sm tracking-wide uppercase transition-colors hover:text-primary ${
                      isActive ? "text-primary font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                    {hasGroups && <ChevronDown className="w-3 h-3 opacity-60" />}
                  </Link>

                  {hasGroups && (
                    <AnimatePresence>
                      {openDropdown === link.href && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-3"
                        >
                          <div className="bg-background border border-border shadow-xl px-8 py-6 grid grid-cols-3 gap-10 min-w-[640px]">
                            {link.groups!.map((group) => (
                              <div key={group.href} className="flex flex-col gap-3">
                                <Link
                                  href={group.href}
                                  className="font-serif text-base text-foreground hover:text-primary transition-colors pb-2 border-b border-border/60"
                                >
                                  {group.label}
                                </Link>
                                {group.items.map((item) => (
                                  <Link
                                    key={item.filter}
                                    href={`${group.href}#${encodeURIComponent(item.filter)}`}
                                    className="text-sm font-light text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
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
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-50 w-[80%] max-w-sm bg-background border-l border-border p-6 shadow-2xl flex flex-col overflow-y-auto"
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
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => {
                  const hasGroups = !!link.groups?.length;
                  const expanded = mobileExpanded === link.href;
                  return (
                    <div key={link.href} className="border-b border-border/60 pb-3">
                      <div className="flex items-center justify-between">
                        <Link
                          href={link.href}
                          className="font-serif text-3xl tracking-tight text-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                        {hasGroups && (
                          <button
                            onClick={() =>
                              setMobileExpanded(expanded ? null : link.href)
                            }
                            className="p-2 text-muted-foreground"
                            aria-label="Toggle subcategories"
                          >
                            <ChevronDown
                              className={`w-5 h-5 transition-transform ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {hasGroups && expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-5 pt-4 pl-2">
                              {link.groups!.map((group) => (
                                <div key={group.href} className="flex flex-col gap-2">
                                  <Link
                                    href={group.href}
                                    className="font-serif text-lg text-foreground hover:text-primary transition-colors"
                                  >
                                    {group.label}
                                  </Link>
                                  <div className="flex flex-col gap-1.5 pl-3 border-l border-border/60">
                                    {group.items.map((item) => (
                                      <Link
                                        key={item.filter}
                                        href={`${group.href}#${encodeURIComponent(item.filter)}`}
                                        className="font-light text-sm text-muted-foreground hover:text-primary transition-colors"
                                      >
                                        {item.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
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
