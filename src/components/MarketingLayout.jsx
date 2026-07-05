import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, ArrowRight, Menu, X, Globe, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

export function MarketingLayout() {
  const { isAuthenticated } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/';


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold focus:shadow-lg">
        Skip to main content
      </a>
      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="max-w-6xl mx-auto backdrop-blur-md bg-zinc-950/70 border border-zinc-800/80 shadow-2xl rounded-full px-6 h-14 flex items-center justify-between text-white">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" aria-label="Api Coolie Homepage" className="flex items-center hover:opacity-90 transition-opacity">
              <img src="/api-coolie-text-transparent.webp" alt="Api Coolie Logo" width="130" height="28" className="h-7 w-auto object-contain" />
            </Link>
          </div>

          {/* Nav links (Desktop) */}
          <nav className="hidden md:flex space-x-6 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/tutorials" className="hover:text-white transition-colors">Tutorials</Link>
            <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link to="/status" className="hover:text-white transition-colors">Status</Link>
            <Link to="/changelog" className="hover:text-white transition-colors">Changelog</Link>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-3.5">
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white border border-zinc-800"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 bg-primary text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full hover:bg-primary/95 transition-all shadow-sm animate-pulse"
              >
                Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[11px] font-extrabold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full hover:bg-primary/95 transition-all shadow-sm uppercase tracking-wider"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-muted/10 hover:bg-muted/20 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-1.5 rounded-full hover:bg-muted/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="max-w-6xl mx-auto mt-2 md:hidden border border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-5 py-4 rounded-3xl space-y-2 shadow-lg text-white">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">Pricing</Link>
            <Link to="/tutorials" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">Tutorials</Link>
            <Link to="/docs" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">Docs</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">Blog</Link>
            <Link to="/status" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">Status</Link>
            <Link to="/changelog" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">Changelog</Link>
            <hr className="border-zinc-800 my-2" />
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-primary text-white py-2 rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center border border-zinc-800 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center bg-primary text-white py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main id="main-content" className={`flex-grow ${isLandingPage ? '' : 'pt-24 md:pt-28'}`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/5 py-12 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="text-base font-extrabold text-primary flex items-center gap-1">
              <img src="/api-coolie-porter-logo.webp" alt="Api Coolie Porter Logo" width="20" height="20" className="h-5 w-5 object-contain" /> Api Coolie
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Automated high-precision task runner carrying your cron loops, script isolates, and endpoint routing configurations on time, every time.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[10px]">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/versus" className="hover:text-primary transition-colors">Compare Alternatives</Link></li>
              <li><Link to="/tools/json-formatter" className="hover:text-primary transition-colors">JSON Formatter</Link></li>
              <li><Link to="/status" className="hover:text-primary transition-colors">System Status</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[10px]">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link></li>
              <li><Link to="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[10px]">Legal Policies</h3>
            <ul className="space-y-2">
              <li><Link to="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal/security" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Api Coolie. Handcrafted with precision.</span>
          <div className="flex gap-4 items-center">
            <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
            <a href="https://x.com/apicoolie" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</a>
            <a href="https://github.com/apicoolie" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
