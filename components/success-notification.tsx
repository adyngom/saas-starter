'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SuccessNotificationProps {
  title?: string;
  message?: string;
  storageKey?: string;
}

export function SuccessNotification({ 
  title = "Payment Successful!",
  message = "Your subscription has been activated and you now have access to all features.",
  storageKey = "stripe-checkout-success"
}: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if success notification should be shown
    const shouldShow = sessionStorage.getItem(storageKey);
    if (shouldShow === 'true') {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.removeItem(storageKey);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md">
      <Alert className="border-green-200 bg-green-50 text-green-800 shadow-lg">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-green-700 mt-1">{message}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}