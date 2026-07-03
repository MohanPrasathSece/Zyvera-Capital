import type { IncomingMessage, ServerResponse } from "http";
import { submitToCRM } from "../api-lib/crm";
import { getUsers, saveUsers, User } from "../api-lib/blobDb";

async function parseJsonBody(req: IncomingMessage & { body?: any }): Promise<Record<string, any>> {
  try {
    if (req.body !== undefined && req.body !== null) {
      return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }
  } catch (e) {
    console.warn("[API Signup] Pre-parsed body resolution failed, falling back:", e);
  }

  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

    const body = await parseJsonBody(req);
    const { name, email, phone, countryCode } = body;

    console.log(`[API Signup Request] Name: "${name}", Email: "${email}", Phone: "${phone}", CountryCode: "${countryCode || "CH"}"`);

    if (!name || !email || !phone) {
      console.warn(`[API Signup Warning] Rejection: Name, email, or phone is missing.`);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Name, email, and phone are required" }));
      return;
    }

    // 1. Submit to CRM first
    console.log(`[API Signup] Submitting to CRM...`);
    try {
      await submitToCRM({
        name,
        email,
        phone,
        description: "Signup Lead",
        outlineYourCase: "Signup Lead",
        countryCode: countryCode || "CH",
      });
      console.log(`[API Signup] CRM submission succeeded.`);
    } catch (crmError) {
      const errMsg = (crmError as Error).message || "";
      if (errMsg.toLowerCase().includes("already exist")) {
        console.warn("[API Signup Warning] CRM lead already exists, continuing with signup flow:", crmError);
      } else {
        console.error("[API Signup Error] CRM Submission failed during signup:", crmError);
        throw new Error(`CRM Submission failed: ${errMsg}`);
      }
    }

    // 2. Continue with Blob / Vercel Signup Flow
    console.log(`[API Signup] Fetching current user list...`);
    const users = await getUsers();
    const existingUserIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    const updatedUser: User = {
      email: email.toLowerCase(),
      name: name,
      phone: phone,
      createdAt:
        existingUserIndex >= 0 ? users[existingUserIndex].createdAt : new Date().toISOString(),
    };

    if (existingUserIndex >= 0) {
      console.log(`[API Signup] User already exists. Updating details for: "${email}"`);
      users[existingUserIndex] = updatedUser;
    } else {
      console.log(`[API Signup] New user signup. Registering: "${email}"`);
      users.push(updatedUser);
    }

    console.log(`[API Signup] Saving updated user database...`);
    await saveUsers(users);
    console.log(`[API Signup Success] Registration complete for: "${email}"`);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, user: updatedUser }));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Signup Error] Critical failure during signup:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: err.message || "Internal server error" }));
  }
}
