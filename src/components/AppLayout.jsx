import React, { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  CalendarDays,
  KeyRound,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Plus,
  Terminal,
  Bookmark,
  ListCollapse,
  Settings2,
  Coins,
  Bell,
  CheckCircle2,
  AlertCircle,
  Activity,
  Palette
} from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { apiClient } from '../utils/apiClient.js';

export function AppLayout() {
  const { user, isAuthenticated, logout, accounts, switchAccount, addAccount, removeAccount } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const profileRef = useRef(null);
  const bellRef = useRef(null);

  // Poll jobs & executions to dynamically update sidebar badges
  const { data: jobs } = useQuery({
    queryKey: ['sidebar-jobs'],
    queryFn: () => apiClient.get('/jobs'),
    refetchInterval: 15000,
    enabled: isAuthenticated
  });

  const { data: executions } = useQuery({
    queryKey: ['sidebar-executions'],
    queryFn: () => apiClient.get('/executions?limit=10'),
    refetchInterval: 15000,
    enabled: isAuthenticated
  });

  const activeJobsCount = jobs?.filter(j => j.status === 'active').length || 0;
  const hasFailedExecution = executions?.some(ex => ex.status === 'failed') || false;

  useEffect(() => {
    // Clear other theme classes and apply current
    const themesList = ['theme-light', 'theme-dark', 'theme-neon', 'theme-metallic', 'theme-glassy', 'theme-bright'];
    document.documentElement.classList.forEach(cls => {
      if (themesList.includes(cls)) {
        document.documentElement.classList.remove(cls);
      }
    });
    
    // Legacy support for dark class
    if (theme === 'dark' || theme === 'theme-dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add(`theme-${theme}`);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    // authStore.logout() handles redirect internally
    logout();
  };

  const navSections = [
    {
      label: 'MAIN',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Jobs', path: '/jobs', icon: CalendarDays, badge: activeJobsCount ? String(activeJobsCount) : null },
        { name: 'Executions', path: '/executions', icon: Terminal, dot: hasFailedExecution },
      ]
    },
    {
      label: 'MANAGE',
      items: [
        { name: 'API Tokens', path: '/tokens', icon: KeyRound },
        { name: 'Templates', path: '/templates', icon: Bookmark },
        { name: 'Activity Log', path: '/activity', icon: ListCollapse },
        { name: 'JSON Suite', path: '/json-formatter', icon: Settings2 },
      ]
    },
    {
      label: 'ACCOUNT',
      items: [
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Billing', path: '/billing', icon: Coins, textBadge: user?.plan || 'free' },
      ]
    }
  ];

  const isPathActive = (path) => {
    if (path === '/jobs') {
      return location.pathname.startsWith('/jobs') && !location.pathname.startsWith('/json-formatter') && !location.pathname.startsWith('/activity') && !location.pathname.startsWith('/templates');
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      
      {/* SIDEBAR - DESKTOP */}
      <aside
        className={`hidden md:flex flex-col border-r border-border/40 bg-card transition-all duration-300 fixed top-0 bottom-0 left-0 h-screen z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/40">
          {!sidebarCollapsed ? (
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/Api Coolie text transparent.png" alt="Api Coolie Logo" className="h-10 w-auto object-contain" />
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto flex items-center justify-center">
              <img src="/Api Coolie porter logo.png" alt="Icon" className="h-8 w-8 object-contain" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(p => !p)}
            className="absolute -right-4 top-6 bg-card border border-border/60 hover:bg-muted/10 rounded-full p-1.5 text-muted-foreground hover:text-foreground shadow-sm"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-border/40 flex items-center gap-3">
          <div className="relative shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} className="h-9 w-9 rounded-full border border-primary/20 object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col text-xs truncate">
              <span className="font-extrabold text-sm text-foreground truncate">{user?.fullName || 'Developer'}</span>
              <span className="text-[10px] uppercase font-extrabold text-primary tracking-wider">{user?.plan || 'free'} plan</span>
            </div>
          )}
        </div>

        {/* Pin New Job Button */}
        <div className="px-3 pt-4">
          <button
            onClick={() => navigate('/jobs/new')}
            className="w-full py-2 px-3 bg-primary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-sm"
          >
            <Plus className="h-4.5 w-4.5 shrink-0" />
            {!sidebarCollapsed && <span>New Job</span>}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow px-3 py-4 overflow-y-auto space-y-4">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-1">
              {!sidebarCollapsed && (
                <span className="text-[11px] font-extrabold text-muted-foreground/60 tracking-wider block px-3 pt-2">
                  {section.label}
                </span>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isPathActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    title={item.name}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${
                      active
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/15'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                      {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                    </div>

                    {!sidebarCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                            {item.badge}
                          </span>
                        )}
                        {item.textBadge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase rounded ${active ? 'bg-white/20 text-white' : 'bg-muted/30 text-muted-foreground border border-border/40'}`}>
                            {item.textBadge}
                          </span>
                        )}
                        {item.dot && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/40">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors group"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            {!sidebarCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR PANEL */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-64 bg-card flex flex-col h-full border-r border-border/40 z-10 p-4 space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <span className="text-xl font-bold text-primary">Api Coolie</span>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-muted/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-4 overflow-y-auto">
              {navSections.map((section) => (
                <div key={section.label} className="space-y-1">
                  <span className="text-[10px] font-extrabold text-muted-foreground/60 tracking-wider block px-3">
                    {section.label}
                  </span>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isPathActive(item.path);
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        title={item.name}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                          active
                            ? 'bg-primary text-white'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4.5 w-4.5" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="border-t border-border/40 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className={`flex-grow flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* HEADER TOP BAR */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/40 bg-card sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-muted/20 md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Header Page Title */}
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight capitalize md:block hidden">
                {location.pathname.split('/')[1] === 'json-formatter' ? 'JSON Formatter Suite' : location.pathname.split('/')[1] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen(!bellOpen)}
                className="p-2 rounded-xl hover:bg-muted/15 transition-colors text-muted-foreground hover:text-foreground relative"
                title="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {hasFailedExecution && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border/40 rounded-2xl shadow-lg py-2 z-50 text-xs text-foreground">
                  <div className="px-4 py-2 border-b border-border/30 font-bold text-muted-foreground">Recent Events</div>
                  <div className="divide-y divide-border/30 max-h-[300px] overflow-y-auto">
                    {hasFailedExecution ? (
                      <div className="p-3 flex items-start gap-2.5">
                        <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-rose-500">Failed execution detected</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">One of your api/code worker jobs recently returned an error code.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground italic">No system warnings active.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile dropdown */}
            <div className="relative pl-3 border-l border-border/45" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} className="h-8 w-8 rounded-full border border-primary/20 object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold font-mono">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border/40 rounded-2xl shadow-lg py-2 z-50 text-xs text-foreground">
                  <div className="px-4 py-2 border-b border-border/30">
                    <p className="font-bold text-foreground">{user?.fullName || 'Developer'}</p>
                    <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                  </div>
                  
                  {/* Theme Switcher Options */}
                  <div className="px-4 py-2 border-b border-border/30 space-y-1.5">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Palette className="h-3.5 w-3.5" /> Custom Theme
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'light', label: 'Light' },
                        { id: 'dark', label: 'Dark' },
                        { id: 'neon', label: 'Neon' },
                        { id: 'metallic', label: 'Metallic' },
                        { id: 'glassy', label: 'Glassy' },
                        { id: 'bright', label: 'Bright' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                            theme === t.id
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'border-border/40 hover:bg-muted/15 text-muted-foreground'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Account Switcher Section */}
                  <div className="px-4 py-2 border-b border-border/30 space-y-2">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5" /> Switch Accounts
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {accounts && accounts.map(acc => {
                        const isActive = acc.user.id === user?.id;
                        return (
                          <div key={acc.user.id} className={`flex items-center justify-between p-1.5 rounded-lg border transition-colors ${isActive ? 'bg-primary/5 border-primary/20' : 'border-transparent hover:bg-muted/15'}`}>
                            <button
                              type="button"
                              onClick={() => !isActive && switchAccount(acc.user.id)}
                              className="flex items-center gap-2 flex-grow text-left focus:outline-none"
                              disabled={isActive}
                              title={isActive ? 'Active account' : `Switch to ${acc.user.fullName}`}
                            >
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold shrink-0">
                                {acc.user.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate pr-1">
                                <p className={`font-semibold leading-tight ${isActive ? 'text-primary' : 'text-foreground'}`}>{acc.user.fullName}</p>
                                <p className="text-[8px] text-muted-foreground leading-tight truncate">{acc.user.email}</p>
                              </div>
                            </button>
                            {!isActive && (
                              <button
                                type="button"
                                onClick={() => removeAccount(acc.user.id)}
                                className="text-red-400 hover:text-red-500 font-bold px-1.5 hover:bg-red-500/10 rounded text-sm"
                                title="Remove account"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={addAccount}
                      className="w-full text-center py-1.5 border border-dashed border-border rounded-xl text-primary font-bold hover:bg-primary/5 flex items-center justify-center gap-1 mt-1 text-[10px]"
                    >
                      <Plus className="h-3 w-3" /> Add Account
                    </button>
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-muted/15 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 hover:bg-rose-500/10 font-semibold text-red-500"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* PAGE SCREEN CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-[98%] w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
