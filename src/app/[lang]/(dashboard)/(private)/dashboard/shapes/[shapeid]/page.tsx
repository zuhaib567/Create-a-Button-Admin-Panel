import EditShape from '@/views/apps/shapes/edit/editShape'

const EditShapePage = ({ params }: { params: { shapeid: string } }) => {
  return (
    <div>
      <EditShape id={params.shapeid} />
    </div>
  )
}

export default EditShapePage
