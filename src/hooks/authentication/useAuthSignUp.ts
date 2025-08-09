// hooks/authentication/useAuthSignUp.ts
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRegisterMutation, useSignupWithGoogleMutation } from '@/redux-store/services/auth'
import { notifySuccess, notifyError } from '@/utils/toast'
import { useRouter } from 'next/navigation'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, minLength, email, pipe, nonEmpty, InferInput } from 'valibot'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '@/utils/firebase'

const schema = object({
  name: pipe(string(), minLength(1, 'This field is required')),
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

type ErrorType = {
  message: string[]
}

type FormData = InferInput<typeof schema>

const useAuthSignUp = () => {
  const [register, { isLoading, isError }] = useRegisterMutation()
  const [signupWithGoogle] = useSignupWithGoogleMutation()

  const [errorState, setErrorState] = useState<ErrorType | null>(null)

  // Hooks
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (values: FormData) => {
    const res = await register(values).unwrap()

    if (res.data) {
      notifySuccess('Account created successfully')
      router.push('/login')
    } else {
      setErrorState({
        message: res?.error?.data?.message ? [res?.error?.data?.message] : ['Registeration failed, please try again.']
      })
    }
  }

  const registerWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('User signed up with Google:', user)
      const idToken = await user.getIdToken()

      const res = await signupWithGoogle({ idToken })

      if ('error' in res) {
        if ('data' in res?.error!) {
          const errorData = res.error.data as { message?: string }
          if (typeof errorData.message === 'string') {
            toast.error(errorData.message)
          }
        }
      } else {
        toast.success('Successfully Authenticated with Google')
        router.push('/dashboard')
        localStorage.setItem('user', JSON.stringify(res.data))
      }
    } catch (err) {
      toast.error('Google registeration failed')
      console.error(err)
    }
  }

  return {
    errorState,
    setErrorState,
    control,
    isLoading,
    handleSubmit,
    registerWithGoogle,
    isError,
    onSubmit,
    register,
    errors
  }
}

export default useAuthSignUp
