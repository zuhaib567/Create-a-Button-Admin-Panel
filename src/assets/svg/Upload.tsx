// React Imports
import type { SVGAttributes } from 'react'

const UploadIcon = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' />
      <polyline points='14,2 14,8 20,8' />
      <path d='m12 18-4-4h3V9h2v5h3l-4 4z' />
    </svg>
  )
}

export default UploadIcon
