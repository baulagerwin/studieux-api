import config from "config";

export default function () {
  if (config.get("jwtPrivateKey")) return;

  console.error("FATAL ERROR: jwtPrivateKey is not set.");
  throw new Error("FATAL ERROR: jwtPrivateKey is not set.");
}
