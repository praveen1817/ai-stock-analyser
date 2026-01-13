
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export async function fetchStockNews(query) {
  

  const url = "https://newsapi.org/v2/everything";

  const response = await axios.get(url, {
    params: {
      q: query,  // e.g., "Tata Motors" or "Reliance Industries"
      language: "en",  // English only (most Indian business news is in English)
      sortBy: "publishedAt",  // Latest first
      pageSize: 20,  // Top 20 articles
      apiKey: process.env.NEWS_API_KEY
    }
  });

  const articles = response.data.articles || [];

  return articles.map(item => ({
    title: item.title || "No title",
    source: item.source?.name || "Unknown",
    description: item.description || "No description",
    url: item.url,
    imageUrl: item.urlToImage || null,
    datetime: new Date(item.publishedAt).toLocaleString()
  }));
}
