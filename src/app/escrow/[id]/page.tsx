import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { EscrowRoomClient } from "@/components/escrow-room-client";
import {
  getBusiness,
  getDocumentsForOrder,
  getLedgerPreview,
  getMilestonesForOrder,
  getOrder,
  getOrderParties,
  orders,
} from "@/lib/data/seed";

export default async function EscrowRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; title?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const seedOrder = getOrder(id) ?? (id === "ord-006" ? orders[5] : undefined);

  if (!seedOrder) {
    notFound();
  }

  const order = query.title
    ? { ...seedOrder, title: query.title }
    : seedOrder;

  const parties = getOrderParties(order);

  return (
    <AppShell>
      <EscrowRoomClient
        order={order}
        buyer={parties.buyer ?? getBusiness(order.buyerBusinessId)}
        seller={parties.seller ?? getBusiness(order.sellerBusinessId)}
        milestones={getMilestonesForOrder(order.id)}
        documents={getDocumentsForOrder(order.id)}
        ledgerPreview={getLedgerPreview(order.id)}
        created={query.created === "1"}
      />
    </AppShell>
  );
}
