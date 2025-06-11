'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Copy, Check } from 'lucide-react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      reset();
    } finally {
      setTimeout(() => setIsResetting(false), 1000);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const isSetupError = error.message?.includes('table') || error.message?.includes('database');

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Error Icon and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isSetupError ? 'Setup Required' : 'Something went wrong'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isSetupError 
                ? 'The application needs to be set up before you can continue.' 
                : 'An unexpected error occurred. Please try again or contact support if the problem persists.'
              }
            </p>
          </div>
        </div>

        {/* Main Error Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Error Details
            </CardTitle>
            <CardDescription>
              {isSetupError ? 'Database setup is required' : 'Technical information about the error'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Error Message:</h3>
              <code className="text-sm text-red-700 dark:text-red-300 break-words">
                {error.message}
              </code>
            </div>

            {/* Error Digest */}
            {error.digest && (
              <div className="bg-gray-50 dark:bg-gray-800/50 border rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Error ID:</h3>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {error.digest}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(error.digest!)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions (only if it's a setup error) */}
        {isSetupError && (
          <Card>
            <CardHeader>
              <CardTitle>Database Setup Instructions</CardTitle>
              <CardDescription>
                Follow these steps to set up your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Create the users table:</h3>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  username VARCHAR(255)
);`}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  username VARCHAR(255)
);`)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">2. Insert test data (optional):</h3>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`INSERT INTO users (email, name, username) 
VALUES ('test@example.com', 'Test User', 'testuser');`}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`INSERT INTO users (email, name, username) 
VALUES ('test@example.com', 'Test User', 'testuser');`)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Retrying...' : 'Try Again'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            If the problem persists, please contact support with the error ID above.
          </p>
        </div>
      </div>
    </main>
  );
}