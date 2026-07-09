
import { put, list } from "@vercel/blob";
import type { IncomingMessage, ServerResponse } from "http";

const BLOB_KEY = "leads-count.json";

async function getCount(): Promise<number> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const { blobs } = await list({
      prefix: BLOB_KEY,
      token,
      storeId: process.env.BLOB_STORE_ID
    });
    if (blobs.length === 0) return 0;

    const blobUrl = blobs[0].downloadUrl || blobs[0].url;
    const cacheBustedUrl = blobUrl.includes("?")
      ? `${blobUrl}&t=${Date.now()}`
      : `${blobUrl}?t=${Date.now()}`;

    const res = await fetch(cacheBustedUrl, {
      headers: token && token !== "undefined" && token !== "null"
        ? { Authorization: `Bearer ${token}` }
        : {},
    });
    if (!res.ok) return 0;
    const json = (await res.json()) as { count?: unknown };
    return typeof json.count === "number" ? json.count : 0;
  } catch (err) {
    console.error("[leads-count] getCount error:", err);
    return 0;
  }
}

async function setCount(count: number): Promise<void> {
  await put(BLOB_KEY, JSON.stringify({ count }), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    storeId: process.env.BLOB_STORE_ID,
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    if (req.method === "GET") {
      const count = await getCount();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ count }));
      return;
    }

    if (req.method === "POST") {
      const current = await getCount();
      const next = current + 1;
      await setCount(next);
      console.log(`[leads-count] incremented → ${next}`);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ count: next }));
      return;
    }

    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
  } catch (err) {
    console.error("[leads-count] Error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error", details: String(err) }));
  }
}

