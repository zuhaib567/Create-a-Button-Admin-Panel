import EditTemplate from "@/views/apps/template/list/edit/editTemplate";

const EditTempletePage = ({ params }: { params: { templeteid: string } }) => {
  return (
    <div>
      <EditTemplate id={params.templeteid} />
    </div>
  )
}

export default EditTempletePage;