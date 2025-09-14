import { nanoid } from "nanoid";

export function generateSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with "-"
    .replace(/^-+|-+$/g, ""); // trim leading/trailing "-"
  const uniqueSuffix = nanoid(6); // 6 random characters
  return `${base}-${uniqueSuffix}`;
}