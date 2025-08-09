'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import PreviewActions from './PreviewActions'
import PreviewCard from './PreviewCard'
import { useGetSingleOrderQuery } from '@/redux-store/services/order'
import { redirect } from 'next/navigation'

const Preview = ({ id }: { id: string }) => {
  const { data: invoiceData } = useGetSingleOrderQuery(id)

  if (!invoiceData) {
    redirect('/not-found')
  }

  // Handle Print Button Click
  const handleButtonClick = () => {
    window.print()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={9}>
        <PreviewCard invoiceData={invoiceData} />
      </Grid>
      <Grid item xs={12} md={3}>
        <PreviewActions id={id} onButtonClick={handleButtonClick} />
      </Grid>
    </Grid>
  )
}

export default Preview
