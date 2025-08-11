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
  TextFieldProps,
  Typography
} from '@mui/material'

import classnames from 'classnames'

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

import useTemplateCategorySubmit from '@/hooks/useTemplateCategorySubmit'
import type { ICategoryItem } from '@/types/apps/templateCategoryTypes'
import TablePaginationComponent from '@/components/TablePaginationComponent'

import {
  useDeleteTemplateCategoryMutation,
  useGetAllTemplateCategoriesQuery
} from '@/redux-store/services/templateCategory'
import type { CategoryRes } from '@/types/apps/templateCategoryTypes'
import { useParams } from 'next/navigation'

const CategoryTables = () => {
  const { data: categories, isError, isLoading } = useGetAllTemplateCategoriesQuery()
  const [deleteCategory, {}] = useDeleteTemplateCategoryMutation()

  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [data, setData] = useState<ICategoryItem[]>([])
  const [filteredData, setFilteredData] = useState<ICategoryItem[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { lang: locale } = useParams()

  useEffect(() => {
    if (categories?.result) {
      setData(categories.result)
      setFilteredData(categories.result)
    }
  }, [categories])

  const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<TextFieldProps, 'onChange'>) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
  }

  const columnHelper = createColumnHelper<CategoryRes>()

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
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.name}
          </Typography>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <Typography className='font-medium text-sm truncate w-96' color='text.primary'>
            {row.original.description || 'No description'}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => deleteCategory(row.original._id)}>
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
                  href: `/${locale}/dashboard/template/template-category/${row.original._id}`,
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

  const { errors, register, handleSubmit, handleSubmitCategory } = useTemplateCategorySubmit()

  let content = null

  if (isLoading) {
    return (
      <Card className='pb-4 px-2'>
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
        <Skeleton variant='rounded' className='w-full mt-4' height={35} />
      </Card>
    )
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg='There was an error' />
  }
  if (!isLoading && !isError && categories?.result.length === 0) {
    content = <ErrorMsg msg='No Template Category Found' />
  }

  if (!isLoading && !isError && categories?.success) {
    content = (
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
    )
  }

  return (
    <Card>
      <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
        <div className='flex max-sm:flex-col max-sm:is-full sm:items-center gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Product'
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
            Add Template Category
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
              <form onSubmit={handleSubmit(handleSubmitCategory)}>
                <div className='mb-6 bg-backgroundPaper px-6 py-8 rounded-md'>
                  <div className='mb-6'>
                    <p className='mb-0 text-base'>Category Name</p>
                    <CustomTextField
                      {...register('name', {
                        required: `Name is required!`
                      })}
                      className='input w-full h-[44px] rounded-md border border-gray6 text-base mt-3'
                      type='text'
                      name='name'
                      placeholder='Enter category name'
                    />
                    <ErrorMsg msg={(errors?.parent?.message as string) || ''} />
                  </div>

                  <div className='mb-6'>
                    <p className='mb-0 text-base'>Description</p>
                    <CustomTextField
                      {...register('description', {
                        required: false
                      })}
                      className='w-full py-3 resize-none'
                      multiline
                      minRows={4}
                      type='text'
                      name='description'
                      placeholder='Description Here'
                    />
                  </div>

                  <Button type='submit' variant='contained' className='w-full'>
                    Add Template Category
                  </Button>
                </div>
              </form>
            </div>
          </Drawer>
        </div>
      </CardContent>
      <div className='overflow-x-auto'>{content}</div>
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

export default CategoryTables
