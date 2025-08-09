'use client'
import React from 'react'

type Props = {
  loading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

const Loader = ({ loading, children, fallback }: Props) => {
  if (loading) {
    return (
      fallback ?? (
        <div className='flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent' />
        </div>
      )
    )
  }

  return <>{children}</>
}

export default Loader
