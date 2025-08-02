'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function CheckoutSuccessHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      // Set flag to show success notification
      sessionStorage.setItem('stripe-checkout-success', 'true');
      
      // Clean up URL by removing the payment parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  return null;
}