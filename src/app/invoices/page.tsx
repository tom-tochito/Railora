import { AppShell } from "@/components/app-shell";
import { InvoiceActions } from "@/components/invoice-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { counterparties, invoices } from "@/lib/data/seed";
import { formatAED } from "@/lib/domain/money";

export default function InvoicesPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <Badge tone="brand">Invoices</Badge>
        <h1 className="mt-3 text-3xl font-semibold">Invoice to escrow workflow</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Create invoices, show UAE e-invoicing readiness fields, convert into
          escrow rooms, and download mock PDFs without external integrations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice register</CardTitle>
          <CardDescription>
            E-invoicing readiness is informational in this prototype.
          </CardDescription>
        </CardHeader>
        <TableScroll>
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="py-3 pr-4">Number</th>
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
                    <td className="py-4 pr-4 font-semibold">{invoice.number}</td>
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
      </Card>
    </AppShell>
  );
}
