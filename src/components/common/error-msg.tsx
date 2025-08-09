import React from 'react'

type ErrorType = {
  msg: string
  mb?: string
}

const ErrorMsg = ({ msg, mb }: ErrorType) => {
  return <div style={{ color: '#EF4444', marginTop: mb }}>{msg}</div>
}

export default ErrorMsg
