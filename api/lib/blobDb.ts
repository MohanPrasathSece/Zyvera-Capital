import { put, list } from "@vercel/blob";
import fs from "fs";
import path from "path";

const LOCAL_DB_PATH = path.resolve(process.cwd(), ".users.json");

export interface User {
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

// Memory cache of users for local testing
let localUsersCache: User[] = [];
if (fs.existsSync(LOCAL_DB_PATH)) {
  try {
    localUsersCache = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8"));
  } catch (e) {
    console.error("Failed to read local users db", e);
  }
}

async function getBlobUrl(): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return null;
  }
  try {
    const { blobs } = await list();
    const userBlob = blobs.find((b) => b.pathname === "users.json");
    return userBlob ? userBlob.url : null;
  } catch (e) {
    console.error("Vercel Blob list error", e);
    return null;
  }
}

export async function getUsers(): Promise<User[]> {
  const blobUrl = await getBlobUrl();
  if (!blobUrl) {
    // Return local database fallback
    return localUsersCache;
  }

  try {
    const response = await fetch(blobUrl, {
      headers: process.env.BLOB_READ_WRITE_TOKEN
        ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
        : {},
    });
    if (!response.ok) {
      return [];
    }
    return (await response.json()) as User[];
  } catch (e) {
    console.error("Failed to fetch users from Vercel Blob, using cache", e);
    return localUsersCache;
  }
}

export async function saveUsers(users: User[]): Promise<void> {
  // Update local cache & file
  localUsersCache = users;
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write users to local file", e);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return;
  }

  try {
    await put("users.json", JSON.stringify(users, null, 2), {
      access: "private",
      addRandomSuffix: false,
    });
  } catch (e) {
    console.error("Failed to put users to Vercel Blob", e);
  }
}
