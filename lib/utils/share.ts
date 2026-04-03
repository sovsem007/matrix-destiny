/**
 * Share-link utilities.
 *
 * Strategy: encode input params in the URL (no backend required).
 * Format: /matrix?dob=1990-06-15&name=Maria
 *         /compatibility?dob1=...&name1=...&dob2=...&name2=...
 */

const APP_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";

export interface MatrixShareParams {
  dob: string;
  name?: string;
}

export interface CompatibilityShareParams {
  dob1: string;
  name1?: string;
  dob2: string;
  name2?: string;
}

export function buildMatrixShareUrl(params: MatrixShareParams): string {
  const url = new URL("/matrix", APP_URL);
  url.searchParams.set("dob", params.dob);
  if (params.name) url.searchParams.set("name", params.name);
  return url.toString();
}

export function buildCompatibilityShareUrl(params: CompatibilityShareParams): string {
  const url = new URL("/compatibility", APP_URL);
  url.searchParams.set("dob1", params.dob1);
  if (params.name1) url.searchParams.set("name1", params.name1);
  url.searchParams.set("dob2", params.dob2);
  if (params.name2) url.searchParams.set("name2", params.name2);
  return url.toString();
}

/** Copy text to clipboard, returns true on success */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}
