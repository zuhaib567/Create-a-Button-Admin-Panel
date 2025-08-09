import Preview from '@/views/apps/invoice/preview'

const InvoicePreviewPage = ({ params }: { params: { invoiceId: string } }) => {
  return (
    <div>
      <Preview id={params.invoiceId} />
    </div>
  )
}

export default InvoicePreviewPage
