'use client'
import React, { useEffect, useMemo, useState } from 'react'

import {
  Button,
  Card,
  CardContent,
  Drawer,
  IconButton,
  MenuItem,
  Skeleton,
  TablePagination,
  Typography
} from '@mui/material'

import classnames from 'classnames'
import Image from 'next/image'

import EditorImgUpload from '../globalImgUpload'
import ErrorMsg from '@/components/common/error-msg'
import tableStyles from '@core/styles/table.module.css'
import OptionMenu from '@core/components/option-menu'
import CustomTextField from '@core/components/mui/TextField'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import useImageSubmit from '@/hooks/useImageSubmit'
import type { IImageItem, ImageRes } from '@/types/apps/imageTypes'
import DebouncedInput from '@/components/common/debounced-input'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { useDeleteImageMutation, useGetAllImagesQuery } from '@/redux-store/services/image'

const ImageTables = () => {
  const { data: images, isError, isLoading } = useGetAllImagesQuery()
  const [deleteImage, {}] = useDeleteImageMutation()

  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [data, setData] = useState<IImageItem[]>([])
  const [filteredData, setFilteredData] = useState<IImageItem[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    if (images?.result) {
      setData(images.result)
      setFilteredData(images.result)
    }
  }, [images])

  const columnHelper = createColumnHelper<ImageRes>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('_id', {
        header: 'ID',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            #{row.original._id}
          </Typography>
        )
      }),
      columnHelper.accessor('url', {
        header: 'Image',
        cell: ({ row }) => (
          <div>
            <Image height={100} width={100} src={row.original.url} alt={row.original.name} />
          </div>
        )
      }),
      columnHelper.accessor('name', {
        header: 'Title',
        cell: ({ row }) => <Typography>{row.original.name}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => deleteImage(row.original._id)}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>

            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Download',
                  icon: 'tabler-download',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Edit',
                  icon: 'tabler-pencil',
                  href: `/en/dashboard/products/category/${row.original._id}`,
                  linkProps: {
                    className: 'flex items-center is-full plb-2 pli-4 gap-2 text-textSecondary'
                  }
                },
                {
                  text: 'Duplicate',
                  icon: 'tabler-copy',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }
              ]}
            />
          </div>
        )
      })
    ],
    [data]
  )

  const table = useReactTable({
    data: filteredData || [],
    columns,
    state: { globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onGlobalFilterChange: setGlobalFilter
  })

  const { errors, control, editorImg, setEditorImg, handleSubmit, register, handleSubmitImage, isSubmitted } =
    useImageSubmit()

  if (isLoading) {
    return <Skeleton variant='rounded' className='w-full' height={400} />
  }

  return (
    <Card>
      <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
        <div className='flex max-sm:flex-col max-sm:is-full sm:items-center gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Images'
            className='max-sm:w-full sm:w-[250px]'
          />
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 is-full sm:is-auto'>
          <div className='flex items-center gap-2 is-full sm:is-auto'>
            <Typography className='hidden sm:block'>Show</Typography>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='w-[70px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
          </div>

          <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setIsOpen(true)}>
            Add Image
          </Button>

          <Drawer
            anchor='right'
            open={isOpen}
            onClose={() => setIsOpen(false)}
            PaperProps={{
              sx: { width: 400, p: 3 } // Adjust width here
            }}
          >
            <div className='col-span-12 lg:col-span-4'>
              <form onSubmit={handleSubmit(async data => await handleSubmitImage({ image_name: data.image_name }))}>
                <div className='mb-6 bg-backgroundPaper px-6 py-8 rounded-md'>
                  <EditorImgUpload isSubmitted={isSubmitted} setImage={setEditorImg} image={editorImg} />

                  <div className='mb-6'>
                    <p className='mb-0 text-base'>Image Name</p>
                    <CustomTextField
                      {...register('image_name', {
                        required: `Image name is required!`
                      })}
                      className='input w-full h-[44px] rounded-md border border-gray6 text-base mt-3'
                      type='text'
                      name='image_name'
                      placeholder='Enter image name'
                    />
                    <ErrorMsg msg={(errors?.parent?.message as string) || ''} />
                  </div>

                  <Button type='submit' variant='contained' className='w-full'>
                    Add Image
                  </Button>
                </div>
              </form>
            </div>
          </Drawer>
        </div>
      </CardContent>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {table?.getFilteredRowModel()?.rows?.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                ?.getRowModel()
                ?.rows?.slice(0, table.getState().pagination.pageSize)!
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}

export default ImageTables
