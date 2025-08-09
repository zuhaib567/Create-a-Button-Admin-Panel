import EditCategory from "@/views/apps/category/edit/editCategory";

const EditCategoryPage = ({ params }: { params: { categoryid: string } }) => {
  return (
    <div>
      <EditCategory id={params.categoryid} />
    </div>
  )
}

export default EditCategoryPage;