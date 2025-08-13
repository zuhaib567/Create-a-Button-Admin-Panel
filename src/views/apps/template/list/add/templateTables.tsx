'use client'

import React, { useEffect, useMemo, useState } from 'react'

import {
  Box,
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
import Image from 'next/image'

import TemplateImgUpload from '../../globalImgUpload'
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

import TablePaginationComponent from '@/components/TablePaginationComponent'
import TemplateCategoryList from '../../templateCatagoryList'
import useTemplateSubmit from '@/hooks/useTemplateSubmit'
import TemplateJsonFile from '../../globalJsonUpload'
import TemplateTags from '../../templateTags'

import type { ITemplateItem, TemplateRes } from '@/types/apps/templateTypes'

import { useDeleteTemplateMutation, useGetAllTemplatesQuery } from '@/redux-store/services/template'
import { useParams } from 'next/navigation'
import { useQueryErrorHandler } from '@/hooks/useQueryErrorHandler'

const TemplateTables = () => {
  const { data: templates, isLoading, isError, error } = useGetAllTemplatesQuery()
  const [deleteTemplate, {}] = useDeleteTemplateMutation()
  const { handleQueryError } = useQueryErrorHandler()

  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [data, setData] = useState<ITemplateItem[]>([])
  const [filteredData, setFilteredData] = useState<ITemplateItem[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { lang: locale } = useParams()

  useEffect(() => {
    if (templates?.data) {
      setData(templates.data)
      setFilteredData(templates.data)
    }
  }, [templates])

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

  const columnHelper = createColumnHelper<TemplateRes>()

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
      columnHelper.accessor('templateName', {
        header: 'Name',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.templateName}
          </Typography>
        )
      }),
      columnHelper.accessor('templateThumbnail', {
        header: 'Thumbnail',
        cell: ({ row }) =>
          row.original.templateThumbnail && (
            <Image
              className='w-16 h-16 rounded-full shrink-0 object-cover'
              src={row.original.templateThumbnail}
              alt='image'
              width={120}
              height={120}
            />
          )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={() => deleteTemplate(row.original._id)}>
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
                  href: `/${locale}/dashboard/template/template-list/${row.original._id}`,
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

  useEffect(() => {
    if (!!error) {
      handleQueryError(error)
    }
  }, [error])

  const {
    errors,
    register,
    handleSubmit,
    handleSubmitTemplate,
    setTemplateImg,
    templateImg,
    isSubmitted,
    tags,
    setTags,
    error: validationError,
    setTemplateJson,
    templateJson
  } = useTemplateSubmit()

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

  if (isError) {
    return (
      <Card
        sx={{
          borderColor: 'error.main',
          backgroundColor: theme => theme.palette.error.light + '20'
        }}
        className='my-[20px] max-w-full py-[1px] px-[2px] border-l-[5px]'
      >
        <CardContent className='flex items-center h-[50px]'>
          <Box>
            <Typography variant='h6' color='error.main'>
              Network error — Please check your internet connection.
            </Typography>
            <Typography variant='body2' color='text.secondary'></Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (!isLoading && !isError && templates?.data.length === 0) {
    content = <ErrorMsg msg='No Template Found' />
  }

  if (!isLoading && !isError && templates?.success) {
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
            Add Template
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
              <form onSubmit={handleSubmit(handleSubmitTemplate)}>
                <div className='mb-6 bg-backgroundPaper px-6 py-8 rounded-md'>
                  <TemplateImgUpload isSubmitted={isSubmitted} setImage={setTemplateImg} image={templateImg} />

                  <div className='mb-6'>
                    <p className='mb-0 text-base'>Template Name</p>
                    <CustomTextField
                      {...register('name', {
                        required: `Name is required!`
                      })}
                      className='input w-full h-[44px] rounded-md border border-gray6 text-base mt-3'
                      type='text'
                      name='name'
                      placeholder='Template Name Here'
                    />
                    <ErrorMsg msg={(errors?.name?.message as string) || ''} />
                  </div>

                  <TemplateJsonFile isSubmitted={isSubmitted} setJson={setTemplateJson} image={templateJson} />
                  <TemplateCategoryList register={register} />

                  <TemplateTags register={register} tags={tags} setTags={setTags} error={validationError} />

                  <Button type='submit' variant='contained' className='w-full'>
                    Add Template
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

export default TemplateTables
