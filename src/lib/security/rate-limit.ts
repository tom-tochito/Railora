export function checkRateLimitPlaceholder(key: string) {
  return {
    allowed: true,
    key,
    remaining: 100,
    resetAt: new Date(Date.now() + 60_000).toISOString(),
  };
}
