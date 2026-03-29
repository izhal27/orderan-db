export type PublicRuntimeEnvKey =
  | "NEXT_PUBLIC_API_URL"
  | "NEXT_PUBLIC_WEBSOCKET_URL"
  | "NEXT_PUBLIC_IMAGE_PATH";

export const getPublicRuntimeEnv = (
  key: PublicRuntimeEnvKey,
  fallback: string = "",
): string => {
  if (typeof window !== "undefined") {
    const fromWindow = window.__ENV?.[key];
    if (fromWindow) return fromWindow;
  }

  const fromProcess = process.env[key];
  if (fromProcess) return fromProcess;

  return fallback;
};
