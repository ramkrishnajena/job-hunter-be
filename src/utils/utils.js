export function getPagination(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

export function normalizeText(text = "") {
  if (!text || typeof text !== "string") return "";

  let cleaned = text;

  // 1️⃣ Decode escaped characters like \n, \t, \r
  cleaned = cleaned
    .replaceAll(/\\[nrt]/g, " ") // literal \n, \t, \r
    .replaceAll(/\r?\n|\t/g, " "); // real newlines/tabs

  // 2️⃣ Remove HTML tags (safe for dynamic text)
  cleaned = cleaned.replaceAll(/<[^>]+>/g, " ");

  // 3️⃣ Decode HTML entities like &nbsp;, &amp;, etc.
  cleaned = cleaned
    .replaceAll(/&nbsp;/gi, " ")
    .replaceAll(/&amp;/gi, "&")
    .replaceAll(/&lt;/gi, "<")
    .replaceAll(/&gt;/gi, ">");

  // 4️⃣ Remove escaped unicode junk (\u00a0, etc.)
  cleaned = cleaned.replaceAll(/\\u\d+/g, " ");

  // 5️⃣ Normalize all whitespace
  cleaned = cleaned
    .replaceAll(/\s+/g, " ")
    .replaceAll(/\s,/, ",")
    .replaceAll(/\s\./, ".")
    .trim();

  // 6️⃣ Capitalize first letter for consistent display
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // 7️⃣ Optional: Limit overly long text for UI preview
  if (cleaned.length > 2000) {
    cleaned = cleaned.substring(0, 2000).trim() + "…";
  }

  return cleaned;
}
