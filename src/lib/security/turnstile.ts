export async function verifyTurnstilePlaceholder(token?: string) {
  return {
    success: true,
    provider: "cloudflare_turnstile_placeholder",
    tokenSeen: Boolean(token),
  };
}
