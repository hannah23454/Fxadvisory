import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MOCK_RATES = { EUR: 0.92, GBP: 0.79, AUD: 1.52 };

export async function GET() {
  const apiKey = '262048aca78c4216915d94215fbc727e';

  try {
    const pairs = [
      { symbol: 'USD/EUR', key: 'EUR' },
      { symbol: 'USD/GBP', key: 'GBP' },
      { symbol: 'USD/AUD', key: 'AUD' },
    ];

    const results = await Promise.allSettled(
      pairs.map(async ({ symbol, key }) => {
        try {
          const url = `https://api.twelvedata.com/exchange_rate?symbol=${symbol}&apikey=${apiKey}`;
          const res = await fetch(url, {
            cache: 'no-store',
            headers: {
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(5000)
          });

          if (!res.ok) {
            throw new Error(`API returned ${res.status}`);
          }

          const data = await res.json();

          if (data.status === 'error' || !data.rate) {
            console.warn(`Twelve Data error for ${symbol}:`, data.message || data.status);
            return { [key]: MOCK_RATES[key as keyof typeof MOCK_RATES] || 1.0 };
          }

          return { [key]: parseFloat(data.rate) };
        } catch (err) {
          console.warn(`Error fetching ${symbol}:`, err instanceof Error ? err.message : String(err));
          return { [key]: MOCK_RATES[key as keyof typeof MOCK_RATES] || 1.0 };
        }
      })
    );

    const rates = Object.assign({}, ...results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.status === 'fulfilled' ? r.value : {})
    );

    return NextResponse.json({
      rates: { ...MOCK_RATES, ...rates },
      timestamp: new Date().toISOString(),
      fallback: Object.keys(rates).length < 3
    });
  } catch (error) {
    console.error('Currency API error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({
      rates: MOCK_RATES,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}
