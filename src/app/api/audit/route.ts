import { getAuditEvents } from "@/lib/data/audit-store";

export async function GET() {
  return Response.json({
    product: "Railora",
    sandbox: true,
    events: getAuditEvents(),
  });
}
