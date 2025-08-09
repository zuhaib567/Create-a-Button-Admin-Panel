'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
// import DeleteTooltip from "../tooltip/delete-tooltip";
// import EditTooltip from "../tooltip/edit-tooltip";
import { useDeleteCategoryMutation } from '@/redux-store/services/category'
import { notifyError } from '@/utils/toast'
import { useRouter } from 'next/navigation'
import Edit from '@/@core/svg/edit'
import Delete from '@/@core/svg/delete'

// prop type
type IPropType = {
  id: string
}

const CategoryEditDelete = ({ id }: IPropType) => {
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const router = useRouter()
  const [deleteCategory, { data: delData, error: delErr }] = useDeleteCategoryMutation()

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete this category ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const res = await deleteCategory(id)
          if ('error' in res) {
            if ('data' in res.error!) {
              const errorData = res.error.data as { message?: string }
              if (typeof errorData.message === 'string') {
                return notifyError(errorData.message)
              }
            }
          } else {
            Swal.fire('Deleted!', `Your category has been deleted.`, 'success')
            router.push('/en/dashboard/category')
          }
        } catch (error) {
          // Handle error or show error message
        }
      }
    })
  }

  return (
    <>
      <div className='relative'>
        <Link href={`/en/dashboard/category/${id}`}>
          <button
            onMouseEnter={() => setShowEdit(true)}
            onMouseLeave={() => setShowEdit(false)}
            className='w-10 h-10 leading-10 bg-primary text-white rounded-md'
          >
            <Edit />
          </button>
        </Link>
        {/* <EditTooltip showEdit={showEdit} /> */}
      </div>
      <div className='relative'>
        <button
          onClick={() => handleDelete(id)}
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
          className='w-10 h-10 leading-[33px] bg-secondary text-white rounded-md'
        >
          <Delete />
        </button>
        {/* <DeleteTooltip showDelete={showDelete} /> */}
      </div>
    </>
  )
}

export default CategoryEditDelete
