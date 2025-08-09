import EditTemplateCategory from "@/views/apps/template/category/edit/editTemplateCategory";

const EditTempleteCategoryPage = ({ params }: { params: { categoryid: string } }) => {
  return (
    <div>
      <EditTemplateCategory id={params.categoryid} />
    </div>
  )
}

export default EditTempleteCategoryPage;