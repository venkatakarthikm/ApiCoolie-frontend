import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MarketingLayout } from './components/MarketingLayout.jsx';
import { AppLayout } from './components/AppLayout.jsx';

// Public pages
import { LandingPage } from './pages/LandingPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { PricingPage } from './pages/PricingPage.jsx';
import { DocsPage } from './pages/DocsPage.jsx';
import { BlogPage } from './pages/BlogPage.jsx';
import { StatusPage } from './pages/StatusPage.jsx';
import { ChangelogPage } from './pages/ChangelogPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { LegalPage } from './pages/LegalPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

// Auth pages
import { LoginPage } from './pages/LoginPage.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage.jsx';
import { TutorialsPage } from './pages/TutorialsPage.jsx';

// Dashboard / App pages
import { DashboardPage } from './pages/DashboardPage.jsx';
import { JobsListPage } from './pages/JobsListPage.jsx';
import { JobCreatePage } from './pages/JobCreatePage.jsx';
import { JobDetailsPage } from './pages/JobDetailsPage.jsx';
import { ExecutionDetailsPage } from './pages/ExecutionDetailsPage.jsx';
import { TokenManagementPage } from './pages/TokenManagementPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

// New Pages
import { ExecutionsListPage } from './pages/ExecutionsListPage.jsx';
import { ActivityLogPage } from './pages/ActivityLogPage.jsx';
import { TemplatesPage } from './pages/TemplatesPage.jsx';
import { BillingPage } from './pages/BillingPage.jsx';
import { JsonFormatterPage } from './pages/JsonFormatterPage.jsx';

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
        <Route path="/tokens" element={<TokenManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 3. ERROR FALLBACKS */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  );
}
