import type { IncomingMessage, ServerResponse } from "http";
import { submitToCRM } from "./_lib/crm.js";

// Simple middleware to parse JSON body
async function parseJsonBody(req: IncomingMessage & { body?: any }): Promise<Record<string, any>> {
  try {
    if (req.body !== undefined && req.body !== null) {
      return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }
  } catch (e) {
    const rawMsg = (e.message || e.toString() || "");
    if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists") || rawMsg.toLowerCase().includes("contacted")) {
      if (typeof res.status === 'function') {
        return res.status(400).json({ error: "You have already contacted us pls wait" });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "You have already contacted us pls wait" }));
        return;
      }
    }

    console.warn("[API Contact] Pre-parsed body resolution failed, falling back:", e);
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
    const rawMsg = (e.message || e.toString() || "");
    if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists") || rawMsg.toLowerCase().includes("contacted")) {
      if (typeof res.status === 'function') {
        return res.status(400).json({ error: "You have already contacted us pls wait" });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "You have already contacted us pls wait" }));
        return;
      }
    }

        resolve({});
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
    try {
      const crmRes = await submitToCRM({
        name,
        email,
        phone,
        description: "Zyvora Finance",
        outlineYourCase: message || "",
        countryCode: countryCode || "CH",
      });
      if (crmRes && crmRes.error) {
        console.warn(`[API Contact Warning] CRM responded with validation error:`, crmRes.error);
      } else {
        console.log(`[API Contact Success] CRM submission completed for: "${email}"`);

    // Sync to dashboard
    try {
      const url = (typeof process !== 'undefined' && process.env && process.env.VITE_DASHBOARD_URL) || "https://lead-dashboard-orcin.vercel.app/api/increment";
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: "Zyvora Finance", type: "contact", name, email})
      }).catch(() => {});
    } catch(e){
    const rawMsg = (e.message || e.toString() || "");
    if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists") || rawMsg.toLowerCase().includes("contacted")) {
      if (typeof res.status === 'function') {
        return res.status(400).json({ error: "You have already contacted us pls wait" });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "You have already contacted us pls wait" }));
        return;
      }
    }
}
      }
    } catch (crmError) {
      const errMsg = (crmError as Error).message || "";
      if (errMsg.toLowerCase().includes("already exist")) {
        console.warn("[API Contact Warning] CRM lead already exists, continuing:", crmError);
      } else {
        console.error("[API Contact Error] CRM Submission failed:", crmError);
      }
    }

    
    // Fire-and-forget: increment leads count
    try {
      const host = req.headers.host || "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      fetch(`${protocol}://${host}/api/leads-count`, { method: "POST" }).catch((err) =>
        console.warn("[leads-count] Failed to increment:", err)
      );
    } catch (e) {
    const rawMsg = (e.message || e.toString() || "");
    if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists") || rawMsg.toLowerCase().includes("contacted")) {
      if (typeof res.status === 'function') {
        return res.status(400).json({ error: "You have already contacted us pls wait" });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "You have already contacted us pls wait" }));
        return;
      }
    }

      console.warn("[leads-count] Error triggering increment:", e);
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, message: "Enquiry submitted successfully" }));
  } catch (error: unknown) {
    const rawMsg = (error.message || error.toString() || "");
    if (rawMsg.toLowerCase().includes("already exist") || rawMsg.toLowerCase().includes("already exists") || rawMsg.toLowerCase().includes("contacted")) {
      if (typeof res.status === 'function') {
        return res.status(400).json({ error: "You have already contacted us pls wait" });
      } else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "You have already contacted us pls wait" }));
        return;
      }
    }

    const err = error as Error;
    console.error("[API Contact Error] CRM submission failed:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error", details: err.message }));
  }
}
