const API_BASE = 'http://localhost:3001';

export async function getStocks() {
  const res = await fetch(`${API_BASE}/stocks`);
  return await res.json();
}

export async function getStockData(ticker, minutes = 1) {
  const res = await fetch(`${API_BASE}/stocks/${ticker}?minutes=${minutes}`);
  return await res.json();
}

export async function getStockCorrelation(tickers) {
  const query = tickers.map(t => `ticker=${t}`).join('&');
  const res = await fetch(`${API_BASE}/stockcorrelation?${query}`);
  return await res.json();
}