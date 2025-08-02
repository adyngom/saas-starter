import { headers } from 'next/headers';

export async function getBaseUrl(): Promise<string> {
  // In production, use the BASE_URL environment variable
  if (process.env.NODE_ENV === 'production' && process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // In development, try to get the URL from headers
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    
    if (host) {
      return `${protocol}://${host}`;
    }
  } catch (error) {
    // Headers might not be available in some contexts
    console.warn('Could not get host from headers, falling back to BASE_URL');
  }

  // Fallback to environment variable
  return process.env.BASE_URL || 'http://localhost:3000';
}