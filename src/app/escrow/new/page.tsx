import { AppShell } from "@/components/app-shell";
import { CreateEscrowForm } from "@/components/create-escrow-form";
import { Badge } from "@/components/ui/badge";
import { counterparties } from "@/lib/data/seed";

export default function CreateEscrowPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <Badge tone="brand">Create escrow order</Badge>
        <h1 className="mt-3 text-3xl font-semibold">
          Structure a UAE B2B milestone escrow
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Invite a counterparty, define VAT-aware AED order terms, split
          milestones, attach document requirements, and create a sandbox escrow
          room.
        </p>
      </div>
      <CreateEscrowForm counterparties={counterparties} />
    </AppShell>
  );
}
