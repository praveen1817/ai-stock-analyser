import axios from 'axios';
import fs from "fs";
import path from "path";
const yahooClient = axios.create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json"
  }
});

export async function getPriceHistory1Y(symbol) {
  if (!symbol) {
    throw new Error("Symbol is required for price history");
  }

  const symbolUpper = symbol.toUpperCase();

  const companyDir = path.join(process.cwd(), "data", "companyDetails", symbolUpper);
  const pricePath = path.join(companyDir, "priceHistory_1y.json");

  if (!fs.existsSync(companyDir)) {
    fs.mkdirSync(companyDir, { recursive: true });
  }

  if (fs.existsSync(pricePath)) {
    console.log(` Loading saved 1Y price history for ${symbolUpper}`);
    const raw = fs.readFileSync(pricePath, "utf-8");
    return JSON.parse(raw);
  }

  console.log(` Fetching 1Y price history for ${symbolUpper}`);

  try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbolUpper}?range=1y&interval=1d`;
        const res = await yahooClient.get(url);

        const chart = res.data?.chart?.result?.[0];
        if (!chart) {
          throw new Error("Invalid Yahoo chart response");
        }

        const timestamps = chart.timestamp;
        const quote = chart.indicators?.quote?.[0];

        const cleanedPrices = timestamps.map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().split("T")[0],
        open: quote.open?.[i]?.toFixed(2),
        high: quote.high?.[i]?.toFixed(2),
        low: quote.low?.[i]?.toFixed(2),
        close: quote.close?.[i]?.toFixed(2),
        volume: quote.volume?.[i]
      })).filter(p => p.close != null);

    const payload = {
      symbol: symbolUpper,
      range: "1Y",
      fetchedAt: new Date().toISOString(),
      prices: cleanedPrices,
    };

    fs.writeFileSync(pricePath, JSON.stringify(payload, null, 2));
    console.log(` 1Y price history saved for ${symbolUpper}`);

    return payload;
  } catch (error) {
    console.error(` Failed to fetch price history for ${symbolUpper}:`, error.message);
    throw new Error(`Could not fetch price history for ${symbolUpper}`);
  }
}