import { auditEvents } from "@/lib/data/seed";
import type { AuditEvent } from "@/lib/domain/types";

const runtimeAuditEvents: AuditEvent[] = [];

export function recordAuditEvent(event: Omit<AuditEvent, "id" | "createdAt">) {
  const created: AuditEvent = {
    ...event,
    id: `audit-runtime-${runtimeAuditEvents.length + 1}`,
    createdAt: new Date().toISOString(),
  };

  runtimeAuditEvents.unshift(created);
  return created;
}

export function getAuditEvents() {
  return [...runtimeAuditEvents, ...auditEvents];
}

export function exportAuditLogJson() {
  return JSON.stringify(getAuditEvents(), null, 2);
}
