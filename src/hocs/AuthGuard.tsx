'use client'

import AuthRedirect from '@/components/AuthRedirect'
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const authenticated = localStorage.getItem('user') ?? localStorage.getItem('token')

  return <>{authenticated ? children : <AuthRedirect lang={locale} />}</>
}
