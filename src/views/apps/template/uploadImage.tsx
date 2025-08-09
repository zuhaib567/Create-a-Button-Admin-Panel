'use client'
import React from 'react'
import Image from 'next/image'
import SmClose from '@/@core/svg/smClose'
import useCloudinary from '@/hooks/useCloudinary'
import upload_default from '@/assets/Icons/upload.png'

type IPropType = {
  file: { url: string; id: string }
  setFormData?: React.Dispatch<React.SetStateAction<string[]>>
  setImgUrl?: React.Dispatch<React.SetStateAction<string>>
  isCenter?: boolean
}

const UploadImage = ({ file, setFormData, setImgUrl, isCenter = false }: IPropType) => {
  const { handleDeleteImg, item } = useCloudinary(file, setFormData, setImgUrl)
  return (
    <>
      {item.url && (
        <div className={`flex flex-row flex-wrap ${isCenter ? 'items-center justify-center' : ''}`}>
          <div className='relative'>
            <Image
              className='inline-flex border rounded-md border-gray6 w-24 max-h-24 p-2'
              src={item.url}
              alt='productImg'
              width={100}
              height={100}
            />
            <button
              onClick={() => handleDeleteImg(file)}
              type='button'
              className='absolute -top-4 -right-3 text-red-500 focus:outline-none'
            >
              <SmClose />
            </button>
          </div>
        </div>
      )}
      {!item.url && (
        <div className={`flex flex-row flex-wrap ${isCenter ? 'items-center justify-center' : ''}`}>
          <div className='relative'>
            <Image
              className='inline-flex border rounded-md border-gray6 w-24 max-h-24 p-2'
              src={upload_default}
              alt='productImg'
              width={100}
              height={100}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default UploadImage
