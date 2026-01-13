import fs from "fs";
import path from "path";
import YahooFinance from "yahoo-finance2";   
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
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
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const prices = await yahooFinance.historical(symbolUpper, {
      period1: startDate,
      period2: endDate,
      interval: "1d",
    });

    if(!prices || prices.length===0){
        throw new Error("No Price Data Returned");
    }

    const cleanedPrices = prices.map(p => ({
      date: p.date.toISOString().split("T")[0],
      open: p.open?.toFixed(2),
      high: p.high?.toFixed(2),
      low: p.low?.toFixed(2),
      close: p.close?.toFixed(2),
      volume: p.volume,
      adjClose: p.adjClose?.toFixed(2),
    }));

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