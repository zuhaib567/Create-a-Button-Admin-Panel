// Component Imports
import Preview from '@views/apps/invoice/preview'

const PreviewPage = async ({ params }: { params: { id: string } }) => {
  return <Preview id={params.id} />
}

export default PreviewPage
