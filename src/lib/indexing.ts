import { google } from "googleapis";

const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.store";

/**
 * Auth Google Service Account
 */
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_INDEXING_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/indexing"],
});

console.log("🔑 Indexing auth check:", {
  hasEmail: !!process.env.GOOGLE_INDEXING_CLIENT_EMAIL,
  keyLength: process.env.GOOGLE_INDEXING_PRIVATE_KEY?.length || 0,
});

/**
 * Singleton client (important pour éviter recréation inutile)
 */
const indexingClient = google.indexing({
  version: "v3",
  auth,
});

/**
 * Helper: wait (retry system)
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Normalize URL safely
 */
function buildFullUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/**
 * Send URL to Google Indexing API
 */
export async function notifyGoogleIndexing(
  path: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
) {
  const fullUrl = buildFullUrl(path);

  let lastError: any = null;

  // retry léger (important pour quotas Google)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await indexingClient.urlNotifications.publish({
        requestBody: {
          url: fullUrl,
          type,
        },
      });

      console.log(`📢 Indexing API OK (${attempt}/3):`, fullUrl);
      console.log("Response:", res.data);

      return {
        success: true,
        url: fullUrl,
        response: res.data,
      };
    } catch (error: any) {
      lastError = error;

      console.error(
        `❌ Indexing attempt ${attempt}/3 failed:`,
        error?.message || error
      );

      // backoff progressif
      await sleep(1000 * attempt);
    }
  }

  console.error("🚨 Indexing failed permanently:", fullUrl);

  return {
    success: false,
    url: fullUrl,
    error: lastError,
  };
}