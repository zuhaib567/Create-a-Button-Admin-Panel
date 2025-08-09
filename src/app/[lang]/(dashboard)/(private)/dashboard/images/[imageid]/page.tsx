import EditImage from '@/views/apps/images/edit/editImage'

const EditImagePage = ({ params }: { params: { imageid: string } }) => {
  return (
    <div>
      <EditImage id={params.imageid} />
    </div>
  )
}

export default EditImagePage
