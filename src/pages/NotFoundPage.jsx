import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <Helmet>
        <title>404 Not Found | Api Coolie</title>
      </Helmet>

      <AlertCircle className="h-16 w-16 text-primary mx-auto animate-bounce" />
      <h1 className="text-4xl font-extrabold tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        The resource you are looking for has been archived, deleted, or doesn't exist in our routing directory.
      </p>
      <Link to="/" className="inline-block mt-4">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
}
