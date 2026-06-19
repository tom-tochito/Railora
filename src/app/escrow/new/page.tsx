import { AppShell } from "@/components/app-shell";
import { CreateEscrowForm } from "@/components/create-escrow-form";
import { PageHeader } from "@/components/page-header";
import { counterparties } from "@/lib/data/seed";

export default function CreateEscrowPage() {
  return (
    <AppShell>
      <PageHeader
        badge="Move money"
        title="Create a protected payment"
        description="A focused sandbox flow for recipient, amount, routing preference, fees, data sharing, compliance checks, and final review."
      />
      <CreateEscrowForm counterparties={counterparties} />
    </AppShell>
  );
}
