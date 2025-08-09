'use client'

// React & Next Imports
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { Button, Grid, Card, CardContent, Typography, Divider, Box, Paper } from '@mui/material'
// import { Category, Image, Info, LocalOffer } from '@mui/icons-material'

// Component Imports
import CustomTextField from '@/@core/components/mui/TextField'
import ErrorMsg from '@/components/common/error-msg'
import ProductCategory from '@/views/apps/category/productCategory'
import ProductImgUpload from '@/views/apps/products/productImgUpload'

// Hook
import useProductSubmit from '@/hooks/useProductSubmit'

const AddProductForm = () => {
  const {
    handleSubmit,
    handleSubmitProduct,
    register,
    errors,
    setCategory,
    setParent,
    setChildren,
    setImg,
    img,
    isSubmitted,
    reset
  } = useProductSubmit()

  const { lang: locale } = useParams()
  const router = useRouter()

  return (
    <form onSubmit={handleSubmit(handleSubmitProduct)} className='space-y-8'>
      {/* Page Header */}
      <Box mb={3}>
        <Typography variant='h4' fontWeight={600}>
          Add Product
        </Typography>
        <Typography color='text.secondary'>Fill in product information and publish.</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Panel */}
        <Grid item xs={12} md={4} className='space-y-5'>
          {/* Product Image */}
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={1} mb={2}>
                {/* <Image color='primary' /> */}
                <Typography variant='subtitle1'>Product Image</Typography>
              </Box>
              <ProductImgUpload imgUrl={img} setImgUrl={setImg} isSubmitted={isSubmitted} />
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={1}>
                {/* <Category color='primary' /> */}
                <Typography variant='subtitle1'>Product Category</Typography>
              </Box>
              <ProductCategory setCategory={setCategory} setParent={setParent} setChildren={setChildren} />
              <ErrorMsg msg={errors?.category?.message as string} />
              <Box display='flex' alignItems='center' gap={1} mb={3} mt={4}>
                <Typography variant='subtitle1'>Product Quantity</Typography>
              </Box>
              <CustomTextField
                {...register('quantity', { required: 'Quantity is required!' })}
                fullWidth
                placeholder='e.g. 100'
              />
              <ErrorMsg msg={errors?.quantity?.message as string} />
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={8} className='space-y-5'>
          {/* Product Info */}
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={1} mb={2}>
                {/* <Info color='primary' /> */}
                <Typography variant='subtitle1'>Product Details</Typography>
              </Box>

              <CustomTextField
                {...register('title', { required: 'Product name is required!' })}
                label='Product Name'
                fullWidth
                placeholder='e.g. iPhone 14 Pro Max'
              />
              <ErrorMsg msg={errors?.title?.message as string} />

              <Box mt={3}>
                <CustomTextField
                  {...register('sku', { required: 'SKU is required!' })}
                  label='SKU'
                  fullWidth
                  placeholder='FXSKU-123456'
                />
                <ErrorMsg msg={errors?.sku?.message as string} />
              </Box>

              <Box mt={3}>
                <CustomTextField
                  {...register('description')}
                  label='Description'
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder='Optional product description...'
                />
              </Box>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={1} mb={2}>
                {/* <LocalOffer color='primary' /> */}
                <Typography variant='subtitle1'>Pricing</Typography>
              </Box>

              <CustomTextField
                {...register('price', { required: 'Price is required!' })}
                label='Base Price'
                fullWidth
                placeholder='e.g. $799'
              />
              <ErrorMsg msg={errors?.price?.message as string} />

              <Box mt={3}>
                <CustomTextField
                  {...register('discount', { required: 'Discount is required!' })}
                  label='Discount Price'
                  fullWidth
                  placeholder='e.g. $699'
                />
                <ErrorMsg msg={errors?.discount?.message as string} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sticky Footer Actions */}
      <Paper
        elevation={3}
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          zIndex: 100,
          padding: 2,
          backgroundColor: 'background.paper',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 6
        }}
      >
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => {
            reset()
            router.push(`/${locale}/dashboard/products/list`)
          }}
        >
          Discard
        </Button>
        <Button type='submit' variant='contained' color='primary'>
          Publish Product
        </Button>
      </Paper>
    </form>
  )
}

export default AddProductForm
