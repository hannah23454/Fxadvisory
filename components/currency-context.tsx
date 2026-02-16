import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchLiveCurrencyData } from '@/lib/utils';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRates() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLiveCurrencyData();
        setRates(data.rates);
      } catch (err) {
        setError('Failed to load currency data');
      } finally {
        setLoading(false);
      }
    }
    loadRates();
    // Optionally refresh every 5 minutes
    const interval = setInterval(loadRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CurrencyContext.Provider value={{ rates, loading, error }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
