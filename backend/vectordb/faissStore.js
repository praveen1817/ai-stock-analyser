import fs from "fs";
import path from "path";
import { FaissStore } from "@langchain/community/vectorstores/faiss";  // ← FIXED
import { Document } from "@langchain/core/documents";

import { fetchStockNews } from "../services/newsService.js";
import { localEmbeddings } from "./localEmbeddings.js";

const FAISS_DIR = path.join(process.cwd(), "data", "faiss");

export async function updateNewsVectorStore(symbol) {
  let vectorStore;

  if (fs.existsSync(FAISS_DIR)) {
    console.log(" Loading existing FAISS database");
    vectorStore = await FaissStore.load(FAISS_DIR, localEmbeddings);  // ← FaissStore
  } else {
    console.log(" Creating new empty FAISS database");
    vectorStore = await FaissStore.fromDocuments([], localEmbeddings);  // ← FaissStore
  }

  console.log(` Fetching latest news for: ${symbol}`);
  const news = await fetchStockNews(symbol);

  if (!news.length) {
    console.log(" No new articles found");
    return vectorStore;
  }

  const documents = news.map(item =>
    new Document({
      pageContent: `
        Title: ${item.title}
        Source: ${item.source}
        Date: ${item.datetime}
        Description: ${item.description}
        `.trim(),
              metadata: {
                url: item.url,
                symbol,
              },
            })
          );

  await vectorStore.addDocuments(documents);
  await vectorStore.save(FAISS_DIR);
  console.log(" FAISS database updated and saved");

  return vectorStore;
}

export async function getNewsVectorStore() {
  if (!fs.existsSync(FAISS_DIR)) {
    throw new Error("FAISS database not found. Run updateNewsVectorStore first.");
  }
  console.log(" Loading FAISS database (read-only)");
  return FaissStore.load(FAISS_DIR, localEmbeddings);  // ← FaissStore
}