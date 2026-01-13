import fs from "fs";
import path from "path";
import YahooFinance from "yahoo-finance2";   
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
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
    const quote = await yahooFinance.quoteSummary(symbolUpper, {
      modules: ["assetProfile", "price"],
    });

    const cleanedProfile = {
      symbol: symbolUpper,
      name: quote.price?.longName || "N/A",
      exchange: quote.price?.exchangeName || "N/A",
      currency: quote.price?.currency || "N/A",
      marketCap: quote.price?.marketCap || "N/A",
      sector: quote.assetProfile?.sector || "N/A",
      industry: quote.assetProfile?.industry || "N/A",
      description: quote.assetProfile?.longBusinessSummary || "No description available",
      website: quote.assetProfile?.website || "N/A",
      country: quote.assetProfile?.country || "N/A",
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
