import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const apiKey = '262048aca78c4216915d94215fbc727e';
  
  try {
    const pairs = [
      { symbol: 'USD/EUR', key: 'EUR' },
      { symbol: 'USD/GBP', key: 'GBP' },
      { symbol: 'USD/AUD', key: 'AUD' },
    ];

    const results = await Promise.all(
      pairs.map(async ({ symbol, key }) => {
        try {
          const url = `https://api.twelvedata.com/exchange_rate?symbol=${symbol}&apikey=${apiKey}`;
          const res = await fetch(url, { 
            cache: 'no-store',
            headers: {
              'Accept': 'application/json'
            }
          });
          
          const data = await res.json();
          
          if (data.status === 'error' || !data.rate) {
            console.error(`Twelve Data error for ${symbol}:`, data);
            // Return fallback mock data if API fails
            const mockRates: any = { 'USD/EUR': 0.92, 'USD/GBP': 0.79, 'USD/AUD': 1.52 };
            return { [key]: mockRates[symbol] || 1.0 };
          }
          
          return { [key]: parseFloat(data.rate) };
        } catch (err) {
          console.error(`Error fetching ${symbol}:`, err);
          // Return fallback mock data
          const mockRates: any = { 'USD/EUR': 0.92, 'USD/GBP': 0.79, 'USD/AUD': 1.52 };
          return { [key]: mockRates[symbol] || 1.0 };
        }
      })
    );

    const rates = Object.assign({}, ...results);
    
    return NextResponse.json({ 
      rates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Currency API error:', error);
    // Return fallback mock data on complete failure
    return NextResponse.json({ 
      rates: { EUR: 0.92, GBP: 0.79, AUD: 1.52 },
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}
