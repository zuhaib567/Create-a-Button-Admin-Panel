import React from 'react'

type LoadingType = {
  loading: boolean
  spinner?: 'bar' | 'fade' | 'scale'
  color?: string
}
const Loading = ({ loading, spinner = 'bar', color = '0989FF' }: LoadingType) => {
  return (
    loading && (
      <div className='flex items-center justify-center py-10'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-inherit border-t-primary' />
      </div>
    )
  )
}

export default Loading
