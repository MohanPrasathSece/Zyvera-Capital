import type { IncomingMessage, ServerResponse } from "http";
import { submitToCRM } from "../api-lib/crm";

// Simple middleware to parse JSON body
async function parseJsonBody(req: IncomingMessage & { body?: any }): Promise<Record<string, any>> {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS Headers
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

  try {
    const body = await parseJsonBody(req);
    const { name, email, phone, message, countryCode } = body;

    console.log(`[API Contact Request] Name: "${name}", Email: "${email}", Phone: "${phone}", CountryCode: "${countryCode || "CH"}", Message: "${message || ""}"`);

    // Validate inputs
    if (!name || !email || !phone) {
      console.warn(`[API Contact Warning] Rejection: Name, email, or phone is missing.`);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Name, email, and phone are required" }));
      return;
    }

    // Submit to CRM
    console.log(`[API Contact] Submitting details to CRM...`);
    await submitToCRM({
      name,
      email,
      phone,
      description: message || "Website Contact Lead",
      outlineYourCase: message || "",
      countryCode: countryCode || "CH",
    });
    console.log(`[API Contact Success] CRM submission completed for: "${email}"`);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, message: "Enquiry submitted successfully" }));
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Contact Error] CRM submission failed:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error", details: err.message }));
  }
}
