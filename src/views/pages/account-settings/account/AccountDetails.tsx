'use client'

// React Imports
import { useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import type { SelectChangeEvent } from '@mui/material/Select'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import dayjs from 'dayjs'
import { useUpdateAuthMutation } from '@/redux-store/services/auth'
import { toast } from 'react-toastify'

type UserType = {
    _id: string
    name: string
    phone: string
    email: string
    image: string
    role: string
    joiningDate: string
    status: string
    country: string
    address?: string
}




const AccountDetails = () => {
  // States
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const { name, phone, email, image, role, joiningDate, status, country, address, _id } = userData
  
  const [formData, setFormData] = useState<UserType>({
    _id,
    name,
    phone,
    email,
    image,
    role,
    joiningDate,
    status,
    country,
    address,
  })
  const [fileInput, setFileInput] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string>(formData.image)
  const [updateAuth] = useUpdateAuthMutation()


  const handleFormChange = async(field: keyof UserType, value: UserType[keyof UserType]) => {
    setFormData({ ...formData, [field]: value })
    
  }

  const handleSaveChanges = async (e) => {
    e.preventDefault()
     if (formData?._id && formData) {
      const res = await updateAuth({
        id: formData._id,
        data: {
          email: formData?.email,
          image: imgSrc,
          name: formData.name,
          phone: formData.phone,
          country: formData.country,
          address: formData.address,

        },
      })
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return toast.error(errorData.message);
          }
        }
      } else {
        toast.success("Profile update successfully");
      }
    }
  }

  const handleFileInputChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result as string)
        setFormData({ ...formData, image: reader.result as string })
      }
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc(formData.image)
  }

  return (
    <Card>
      <CardContent className='mbe-4'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
              <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
                Reset
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={handleSaveChanges}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Full Name'
                value={formData.name}
                placeholder='John'
                onChange={e => handleFormChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                value={formData.email}
                placeholder='john.doe@gmail.com'
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Phone Number'
                value={formData.phone}
                placeholder='+1 (234) 567-8901'
                onChange={e => handleFormChange('phone', e.target.value)}
              />
            </Grid>
          
             <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Country'
                value={formData.country}
                placeholder='USA'
                onChange={e => handleFormChange('country', e.target.value)}
              />
            </Grid>
              <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Address'
                value={formData.address}
                placeholder='Address'
                onChange={e => handleFormChange('address', e.target.value)}
              />
            </Grid>
              <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Role'
                value={formData.role}
                placeholder='Role'
                disabled
              />
            </Grid>
              <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Status'
                value={formData.status}
                placeholder='Status'
                disabled
              />
            </Grid>
              <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Joining Date'
                value={dayjs(formData.joiningDate).format('DD/MM/YYYY')}
                placeholder='Joining Date'
                disabled
              />
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button variant='tonal' type='reset' color='secondary' onClick={() => setFormData({
                name,
                phone,
                email,
                image,
                role,
                joiningDate,
                status,
                country,
                address,
                _id
              })}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
