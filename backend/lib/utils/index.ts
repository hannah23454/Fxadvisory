import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fetch live currency data from internal API route
export async function fetchLiveCurrencyData() {
  try {
    const res = await fetch('/api/currency', { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Currency API responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('fetchLiveCurrencyData error:', err);
    // Return fallback data on error
    return { 
      rates: { EUR: 0.92, GBP: 0.79, AUD: 1.52 },
      fallback: true 
    };
  }
}
