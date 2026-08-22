import { createHmac } from "crypto";

export function pepperPassword(password: string) {
  const pepper = process.env.PEPPER;

  if (!pepper) {
    throw new Error("PEPPER is missing");
  }

  return createHmac("sha256", pepper)
    .update(password)
    .digest("hex");
}