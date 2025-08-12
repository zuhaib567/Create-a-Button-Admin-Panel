// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Type Imports
import type { InvoiceType } from '@/types/apps/invoiceTypes'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import './print.css'
import Image from 'next/image'
import { Order } from '@/types/apps/orderTypes'

const PreviewCard = ({ invoiceData }: { invoiceData: Order | undefined }) => {
  return (
    <Card className='previewCard'>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between flex-col gap-6 sm:flex-row'>
                <div className='flex flex-col gap-4'>
                  <Logo />
                  <div>
                    <Typography color='text.primary'>Office 149, 450 South Brand Brooklyn</Typography>
                    <Typography color='text.primary'>San Diego County, CA 91905, USA</Typography>
                    <Typography color='text.primary'>+1 (123) 456 7891</Typography>
                  </div>
                </div>
                <div className='flex flex-col items-start sm:items-end gap-4'>
                  <Typography variant='h5'>{`Invoice #${invoiceData?.invoice}`}</Typography>
                  <Typography>{`Order ID: ${invoiceData?._id}`}</Typography>
                  <Typography>{`Payment: ${invoiceData?.paymentMethod} (${invoiceData?.paymentStatus})`}</Typography>
                  <Typography>{`Status: ${invoiceData?.status}`}</Typography>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice To:
                  </Typography>
                  <div>
                    <Typography>{invoiceData?.name}</Typography>
                    <Typography>{invoiceData?.address}</Typography>
                    <Typography>
                      {' '}
                      {invoiceData?.city}, {invoiceData?.zipCode}, {invoiceData?.country}
                    </Typography>
                    <Typography>{invoiceData?.contact}</Typography>
                    <Typography>{invoiceData?.email}</Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                {invoiceData?.image && (
                  <div className='flex flex-col gap-4'>
                    <Typography className='font-medium' color='text.primary'>
                      Product Image:
                    </Typography>
                    <div className='w-32 h-32 border rounded overflow-hidden'>
                      <Image src={invoiceData.image.url!} alt='Product Image' width={128} height={128} />
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <div className='overflow-x-auto border rounded'>
              <table className={`${tableStyles} min-w-full text-sm`}>
                <thead className='bg-muted'>
                  <tr>
                    <th className='p-3 text-left'>Item</th>
                    <th className='p-3 text-left'>Size</th>
                    <th className='p-3 text-left'>Back Type</th>
                    <th className='p-3 text-left'>Qty</th>
                    <th className='p-3 text-left'>Price</th>
                    <th className='p-3 text-left'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData?.cart.map((item, index) => (
                    <tr key={index} className='border-t'>
                      <td className='p-3'>{item.title}</td>
                      <td className='p-3'>{item.size}</td>
                      <td className='p-3'>{item.backType}</td>
                      <td className='p-3'>{item.orderQuantity}</td>
                      <td className='p-3'>${item.price.toFixed(2)}</td>
                      <td className='p-3'>${(item.price * item.orderQuantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className='flex justify-between flex-col sm:flex-row gap-4'>
              <div className='flex flex-col gap-1'>
                <Typography className='font-medium' color='text.primary'>
                  Salesperson:
                </Typography>
                <Typography>Tommy Shelby</Typography>
                <Typography>Thanks for your business</Typography>
              </div>
              <div className='min-w-[200px]'>
                <div className='flex justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography>${invoiceData?.subTotal}</Typography>
                </div>
                <div className='flex justify-between'>
                  <Typography>Shipping:</Typography>
                  <Typography>${invoiceData?.shippingCost}</Typography>
                </div>
                <div className='flex justify-between'>
                  <Typography>Discount:</Typography>
                  <Typography>${invoiceData?.discount}</Typography>
                </div>
                <Divider className='my-2' />
                <div className='flex justify-between font-medium'>
                  <Typography>Total:</Typography>
                  <Typography>${invoiceData?.totalAmount}</Typography>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Divider className='border-dashed' />
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Note:
              </Typography>{' '}
              It was a pleasure working with you and your team. We hope you will keep us in mind for future projects.
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
