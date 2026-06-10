import { AppShell } from "@/components/app-shell";
import { CreateEscrowForm } from "@/components/create-escrow-form";
import { PageHeader } from "@/components/page-header";
import { counterparties } from "@/lib/data/seed";

export default function CreateEscrowPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Create escrow order"
        title="Structure a UAE B2B milestone escrow"
        description="Invite a counterparty, define VAT-aware AED terms, shape milestones, and preview the funding amount before the room opens."
      />
      <CreateEscrowForm counterparties={counterparties} />
    </AppShell>
  );
}
