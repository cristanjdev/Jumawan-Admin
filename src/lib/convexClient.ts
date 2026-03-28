import { ConvexHttpClient } from 'convex/browser';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;

if (!convexUrl) {
  console.warn('Missing VITE_CONVEX_URL environment variable');
}

export const convexClient = new ConvexHttpClient(convexUrl || '');
