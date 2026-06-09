export async function validateEInvoiceReadiness(invoiceId: string) {
  // TODO: Connect UAE e-invoicing requirements once provider interfaces are live.
  return {
    invoiceId,
    ready: true,
    fields: ["TRN", "VAT breakdown", "buyer legal name", "seller legal name"],
  };
}
