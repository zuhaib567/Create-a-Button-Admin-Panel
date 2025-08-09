'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { IAddProduct } from '@/types/apps/productTypes'
import { notifyError, notifySuccess } from '@/utils/toast'
import { useAddProductMutation, useEditProductMutation } from '@/redux-store/services/product'

type IBCType = {
  name: string
  id: string
}

const useProductSubmit = () => {
  const [img, setImg] = useState<string>('')
  const [relatedImages, setRelatedImages] = useState<string[]>([])
  const [backType, setbackType] = useState<{ name: string; price: number; image: string }[]>([])
  const [sizes, setSizes] = useState<{ name: string; price: number; productSize: string }[]>([])
  const [brand, setBrand] = useState<IBCType>({ name: '', id: '' })
  const [category, setCategory] = useState<IBCType>({ name: '', id: '' })
  const [parent, setParent] = useState<string>('')
  const [children, setChildren] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState<boolean>(true)

  const router = useRouter()

  // useAddProductMutation
  const [addProduct, { data: addProductData, isError, isLoading }] = useAddProductMutation()
  // useAddProductMutation
  const [editProduct, { data: editProductData, isError: editErr, isLoading: editLoading }] = useEditProductMutation()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset
  } = useForm()
  // resetForm

  // handle submit product
  const handleSubmitProduct = async (data: any) => {
    console.log('data', data)
    // product data
    const productData: IAddProduct = {
      sku: data.sku,
      title: data.title,
      parent: parent,
      children: children,
      // tags: tags,
      image: img,
      originalPrice: Number(data.price),
      price: Number(data.price),
      discount: Number(data.discount),
      backType: backType,
      // relatedImages: relatedImages,
      description: data.description,
      // brand: brand,
      category: category,
      unit: data.unit,
      quantity: Number(data.quantity),
      // colors: colors,
      sizes: sizes,
      tags: undefined
    }
    console.log('productData-------------------..>', productData)
    if (!img) {
      return notifyError('Product image is required')
    }
    if (!category.name) {
      return notifyError('Category is required')
    }
    if (Number(data.discount) > Number(data.price)) {
      return notifyError('Product price must be gether than discount')
    } else {
      const res = await addProduct(productData)

      if ('error' in res) {
        if ('data' in res.error) {
          const errorData = res.error.data as { message?: string; errorMessages?: { path: string; message: string }[] }
          if (errorData.errorMessages && Array.isArray(errorData.errorMessages)) {
            const errorMessage = errorData.errorMessages.map(err => err.message).join(', ')
            return notifyError(errorMessage)
          }
          if (typeof errorData.message === 'string') {
            return notifyError(errorData.message)
          }
        }
      } else {
        notifySuccess('Product created successFully')
        setIsSubmitted(true)
        router.push('/product-grid')
      }
    }
  }
  // handle edit product
  const handleEditProduct = async (data: any, id: string) => {
    // product data
    const productData: IAddProduct = {
      sku: data.sku,
      title: data.title,
      parent: parent,
      children: children,
      tags: tags,
      image: img,
      originalPrice: Number(data.price),
      price: Number(data.price),
      discount: Number(data.discount),
      backType: backType,
      // relatedImages: relatedImages,
      description: data.description,
      // brand: brand,
      category: category,
      unit: data.unit,
      quantity: Number(data.quantity),
      // colors: colors,
      sizes: sizes
    }

    const res = await editProduct({ id: id, data: productData })
    if ('error' in res) {
      if ('data' in res.error) {
        const errorData = res.error.data as { message?: string; errorMessages?: { path: string; message: string }[] }
        if (errorData.errorMessages && Array.isArray(errorData.errorMessages)) {
          const errorMessage = errorData.errorMessages.map(err => err.message).join(', ')
          return notifyError(errorMessage)
        }
        if (typeof errorData.message === 'string') {
          return notifyError(errorData.message)
        }
      }
    } else {
      notifySuccess('Product edit successFully')
      setIsSubmitted(true)
      router.push('/product-grid')
    }
  }

  return {
    img,
    setImg,
    parent,
    brand,
    setBrand,
    category,
    setCategory,
    handleSubmitProduct,
    handleEditProduct,
    register,
    handleSubmit,
    errors,
    control,
    setParent,
    setChildren,
    setTags,
    setColors,
    setSizes,
    setRelatedImages,
    setbackType,
    tags,
    isSubmitted,
    backType,
    relatedImages,
    colors,
    sizes,
    reset
  }
}

export default useProductSubmit
