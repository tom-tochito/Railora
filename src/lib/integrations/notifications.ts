export async function enqueueNotification(input: {
  userId: string;
  title: string;
  channel: "email" | "sms" | "in_app";
}) {
  // TODO: Replace with Cloudflare Queues and provider-specific workers.
  return {
    id: `notif-runtime-${Date.now()}`,
    status: "queued" as const,
    ...input,
    createdAt: new Date().toISOString(),
  };
}
