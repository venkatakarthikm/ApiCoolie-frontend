import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MarketingLayout } from './components/MarketingLayout.jsx';
import { AppLayout } from './components/AppLayout.jsx';

// Public pages (lazy-loaded to reduce initial bundle size)
const LandingPage = lazy(() => import('./pages/LandingPage.jsx').then(m => ({ default: m.LandingPage })));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx').then(m => ({ default: m.AboutPage })));
const PricingPage = lazy(() => import('./pages/PricingPage.jsx').then(m => ({ default: m.PricingPage })));
const DocsPage = lazy(() => import('./pages/DocsPage.jsx').then(m => ({ default: m.DocsPage })));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx').then(m => ({ default: m.BlogPage })));
const StatusPage = lazy(() => import('./pages/StatusPage.jsx').then(m => ({ default: m.StatusPage })));
const ChangelogPage = lazy(() => import('./pages/ChangelogPage.jsx').then(m => ({ default: m.ChangelogPage })));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx').then(m => ({ default: m.ContactPage })));
const LegalPage = lazy(() => import('./pages/LegalPage.jsx').then(m => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx').then(m => ({ default: m.NotFoundPage })));

// Auth pages (lazy-loaded)
const LoginPage = lazy(() => import('./pages/LoginPage.jsx').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx').then(m => ({ default: m.SignupPage })));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage.jsx').then(m => ({ default: m.OAuthCallbackPage })));
const TutorialsPage = lazy(() => import('./pages/TutorialsPage.jsx').then(m => ({ default: m.TutorialsPage })));

// Dashboard / App pages (lazy-loaded)
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx').then(m => ({ default: m.DashboardPage })));
const JobsListPage = lazy(() => import('./pages/JobsListPage.jsx').then(m => ({ default: m.JobsListPage })));
const JobCreatePage = lazy(() => import('./pages/JobCreatePage.jsx').then(m => ({ default: m.JobCreatePage })));
const JobDetailsPage = lazy(() => import('./pages/JobDetailsPage.jsx').then(m => ({ default: m.JobDetailsPage })));
const ExecutionDetailsPage = lazy(() => import('./pages/ExecutionDetailsPage.jsx').then(m => ({ default: m.ExecutionDetailsPage })));
const TokenManagementPage = lazy(() => import('./pages/TokenManagementPage.jsx').then(m => ({ default: m.TokenManagementPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx').then(m => ({ default: m.SettingsPage })));

// New Pages (lazy-loaded)
const ExecutionsListPage = lazy(() => import('./pages/ExecutionsListPage.jsx').then(m => ({ default: m.ExecutionsListPage })));
const ActivityLogPage = lazy(() => import('./pages/ActivityLogPage.jsx').then(m => ({ default: m.ActivityLogPage })));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage.jsx').then(m => ({ default: m.TemplatesPage })));
const BillingPage = lazy(() => import('./pages/BillingPage.jsx').then(m => ({ default: m.BillingPage })));
const JsonFormatterPage = lazy(() => import('./pages/JsonFormatterPage.jsx').then(m => ({ default: m.JsonFormatterPage })));
const CurlRunnerPage = lazy(() => import('./pages/CurlRunnerPage.jsx').then(m => ({ default: m.CurlRunnerPage })));
const VersusPage = lazy(() => import('./pages/VersusPage.jsx').then(m => ({ default: m.VersusPage })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  // Initialize dark/light mode classes on initial mount
  useEffect(() => {
    const current = localStorage.getItem('theme') || 'light';
    if (current === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      
      {/* 1. MARKETING / PUBLIC SHELL ROUTES */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:slug" element={<DocsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Supporting multi-segment paths for legals */}
        <Route path="/legal/privacy" element={<LegalPage />} />
        <Route path="/legal/terms" element={<LegalPage />} />
        <Route path="/legal/security" element={<LegalPage />} />

        {/* Auth entry routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/versus" element={<VersusPage />} />
        <Route path="/tools/json-formatter" element={<JsonFormatterPage />} />
      </Route>

      {/* 2. PROTECTED SHELL APP ROUTES */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/jobs/new" element={<JobCreatePage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/jobs/:id/:tab" element={<JobDetailsPage />} />
        <Route path="/jobs/:id/executions/:executionId" element={<ExecutionDetailsPage />} />
        <Route path="/executions" element={<ExecutionsListPage />} />
        <Route path="/activity" element={<ActivityLogPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/json-formatter" element={<JsonFormatterPage />} />
        <Route path="/curl-runner" element={<CurlRunnerPage />} />
        <Route path="/tokens" element={<TokenManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 3. ERROR FALLBACKS */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
    </Suspense>
  );
}
