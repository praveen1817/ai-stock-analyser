import fs from "fs";
import path from "path";
import { getPriceHistory1Y } from "./priceHistoryService.js";

export async function getAnalytics(symbol) {
  if (!symbol) {
    throw new Error("Symbol is required");
  }

  const symbolUpper = symbol.toUpperCase();

  const companyDir = path.join(process.cwd(), "data", "companyDetails", symbolUpper);
  const analyticsPath = path.join(companyDir, "analytics.json");

  if (!fs.existsSync(companyDir)) {
    fs.mkdirSync(companyDir, { recursive: true });
  }

  if (fs.existsSync(analyticsPath)) {
    console.log(` Loading saved analytics for ${symbolUpper}`);
    const raw = fs.readFileSync(analyticsPath, "utf-8");
    return JSON.parse(raw);
  }

  // Fetch price history
  console.log(`🧮 Computing analytics for ${symbolUpper}`);
  const priceData = await getPriceHistory1Y(symbolUpper);
  const prices = priceData.prices;

  if (!prices || prices.length < 2) {
    throw new Error("Not enough price data to compute analytics");
  }

  const dailyReturns = [];
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1].close;
    const curr = prices[i].close;
    if (prev && curr && prev > 0) {
      dailyReturns.push((curr - prev) / prev);
    }
  }

  if (dailyReturns.length === 0) {
    throw new Error("No valid returns calculated");
  }

  // Mean return
  const mean = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;

  // Variance (fixed: ** 2)
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / dailyReturns.length;

  // Daily volatility
  const dailyVolatility = Math.sqrt(variance);

  const annualizedVolatility = dailyVolatility * Math.sqrt(252);

  // 1Y return
  const firstClose = prices[0].close;
  const lastClose = prices[prices.length - 1].close;
  const return1Y = (lastClose - firstClose) / firstClose;
  const return1YPercent = return1Y * 100;

  // Trend direction
  const trendDirection = return1Y > 0.05 ? "Strong upward" :
                        return1Y > 0 ? "Mild upward" :
                        return1Y > -0.05 ? "Flat" :
                        return1Y > -0.2 ? "Mild downward" : "Strong downward";

  const analytics = {
            symbol: symbolUpper,
            period: "1Y",
            dataPoints: prices.length,
            dailyVolatility: Number(dailyVolatility.toFixed(4)),
            annualizedVolatility: Number(annualizedVolatility.toFixed(4)),
            return1YPercent: Number(return1YPercent.toFixed(2)),
            trend: {
              direction: trendDirection,
              return1Y: Number(return1Y.toFixed(4)),
            },
            interpretation: {
              volatility: annualizedVolatility > 0.3 ? "High volatility (risky)" :
                          annualizedVolatility > 0.15 ? "Moderate volatility" : "Low volatility (stable)",
              performance: return1YPercent > 20 ? "Strong growth" :
                          return1YPercent > 0 ? "Positive growth" :
                          return1YPercent > -20 ? "Flat/slight decline" : "Significant decline",
            },
            computedAt: new Date().toISOString(),
          };

  fs.writeFileSync(analyticsPath, JSON.stringify(analytics, null, 2));
  console.log(`Analytics saved for ${symbolUpper}`);

  return analytics;
}