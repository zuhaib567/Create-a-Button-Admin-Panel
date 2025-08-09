'use client'
import { useEffect } from 'react'
import { getRedirectResult } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/utils/firebase'
import { useSignupWithGoogleMutation } from '@/redux-store/services/auth'
import { toast } from 'react-toastify'

export const useGoogleAuthRedirect = () => {
  const router = useRouter()
  const [signupWithGoogle] = useSignupWithGoogleMutation()

  useEffect(() => {
    ;(async () => {
      try {
        const result = await getRedirectResult(auth)

        if (result?.user) {
          const user = result.user
          const idToken = await user.getIdToken()

          const res = await signupWithGoogle({ idToken })

          if ('error' in res) {
            const errorData = res.error as { message?: string }
            if (typeof errorData?.message === 'string') {
              toast.error(errorData.message)
            }
          } else {
            toast.success('Login successful')
            localStorage.setItem('user', JSON.stringify(res.data))
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.error('Google Auth Redirect Error:', error)
        toast.error('Login failed')
      }
    })()
  }, [router])
}
