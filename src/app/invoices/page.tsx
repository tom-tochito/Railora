import { FileCheck2, FileText, Link2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InsightMetric } from "@/components/insight-metric";
import { InvoiceActions } from "@/components/invoice-actions";
import { PageHeader } from "@/components/page-header";
import {
  DesktopRecordTable,
  RecordField,
  ResponsiveRecordCard,
  ResponsiveRecordList,
} from "@/components/responsive-record-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { counterparties, invoices } from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

export default function InvoicesPage() {
  const readyInvoices = invoices.filter((invoice) => invoice.eInvoiceReady).length;
  const escrowInvoices = invoices.filter(
    (invoice) => invoice.status === "escrow_created",
  ).length;
  const totalInvoiceValue = invoices.reduce(
    (sum, invoice) => sum + invoice.amountFils + invoice.vatFils,
    0,
  );

  return (
    <AppShell>
      <PageHeader
        badge="Invoices and links"
        title="Invoice, collect, and protect payment requests"
        description="A premium register for VAT-aware invoices, payment-link creation, escrow conversion, and e-invoicing readiness across the demo network."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <InsightMetric
          label="Invoice value"
          value={formatAED(totalInvoiceValue)}
          detail="Gross invoice value represented in the payment workspace."
          icon={<FileText className="size-4" aria-hidden />}
          tone="brand"
        />
        <InsightMetric
          label="E-invoice ready"
          value={`${readyInvoices} / ${invoices.length}`}
          detail="Records with the required demo readiness markers."
          icon={<FileCheck2 className="size-4" aria-hidden />}
          tone="success"
        />
        <InsightMetric
          label="Escrow-linked"
          value={escrowInvoices}
          detail="Invoices already converted into protected payment flows."
          icon={<Link2 className="size-4" aria-hidden />}
          tone="accent"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice register</CardTitle>
          <CardDescription>
            Review counterparty, VAT, readiness, payment links, and conversion actions in one place.
          </CardDescription>
        </CardHeader>
        <ResponsiveRecordList>
          {invoices.map((invoice) => {
            const counterparty = counterparties.find(
              (item) => item.id === invoice.counterpartyId,
            );

            return (
              <ResponsiveRecordCard key={invoice.id}>
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-base font-semibold">
                      {invoice.number}
                    </p>
                    <p className="mt-1 break-words text-sm text-muted">
                      {counterparty?.name}
                    </p>
                  </div>
                  <Badge tone={invoice.eInvoiceReady ? "success" : "warning"}>
                    {invoice.status.replaceAll("_", " ")}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <RecordField label="Amount" value={formatAED(invoice.amountFils)} />
                  <RecordField label="VAT" value={formatAED(invoice.vatFils)} />
                  <RecordField label="Due" value={invoice.dueDate} />
                </div>
                <div className="mt-4">
                  <InvoiceActions invoiceId={invoice.id} />
                </div>
              </ResponsiveRecordCard>
            );
          })}
        </ResponsiveRecordList>
        <DesktopRecordTable>
          <TableScroll>
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="py-3 pl-4 pr-4">Number</th>
                  <th className="py-3 pr-4">Counterparty</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">VAT</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((invoice) => {
                  const counterparty = counterparties.find(
                    (item) => item.id === invoice.counterpartyId,
                  );

                  return (
                    <tr key={invoice.id} className="align-top">
                      <td className="py-4 pl-4 pr-4 font-semibold">
                        {invoice.number}
                      </td>
                      <td className="py-4 pr-4">{counterparty?.name}</td>
                      <td className="py-4 pr-4">{formatAED(invoice.amountFils)}</td>
                      <td className="py-4 pr-4">{formatAED(invoice.vatFils)}</td>
                      <td className="py-4 pr-4">
                        <Badge tone={invoice.eInvoiceReady ? "success" : "warning"}>
                          {invoice.status.replaceAll("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-4 pr-4">
                        <InvoiceActions invoiceId={invoice.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>
        </DesktopRecordTable>
      </Card>
    </AppShell>
  );
}
