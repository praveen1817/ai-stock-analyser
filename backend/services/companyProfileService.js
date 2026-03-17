import axios from "axios";

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

export async function getCompanyProfile(symbol) {
  if (!symbol) {
    throw new Error("Symbol is required");
  }

  const symbolUpper = symbol.toUpperCase();

  const companyDir = path.join(process.cwd(), "data", "companyDetails", symbolUpper);
  const profilePath = path.join(companyDir, "profile.json");

  if (!fs.existsSync(companyDir)) {
    fs.mkdirSync(companyDir, { recursive: true });
  }

  if (fs.existsSync(profilePath)) {
    console.log(` Loading saved profile for ${symbolUpper}`);
    return JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  }

  console.log(`🌐 Fetching profile for ${symbolUpper} from Yahoo Finance`);

  try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbolUpper}?range=1y&interval=1d`;
      const res = await yahooClient.get(url);
      const chart = res.data?.chart?.result?.[0];

      if (!chart) {
        throw new Error("Invalid Yahoo chart response");
      }

    const meta = chart.meta || {};


        const cleanedProfile = {
          symbol: symbolUpper,
          name: meta.longName || meta.shortName || "N/A",
          exchange: meta.exchangeName || "N/A",
          currency: meta.currency || "N/A",
          marketCap: meta.marketCap || "N/A",
          fetchedAt: new Date().toISOString(),
        };


    fs.writeFileSync(profilePath, JSON.stringify(cleanedProfile, null, 2));
    console.log(`Profile saved for ${symbolUpper}`);

    return cleanedProfile;
  } catch (error) {
    console.error(`Failed to fetch ${symbolUpper}:`, error.message);
    throw new Error(`Could not fetch profile for ${symbolUpper}`);
  }
}
