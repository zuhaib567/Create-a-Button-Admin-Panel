'use client';

import { useEffect, useState } from 'react';
import AuthRedirect from '@/components/AuthRedirect';

import type { Locale } from '@configs/i18n';
import type { ChildrenType } from '@core/types';

export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthenticated(!!(localStorage.getItem('user') || localStorage.getItem('token')));
  }, []);

  if (authenticated === null) return null;

  return <>{authenticated ? children : <AuthRedirect lang={locale} />}</>;
}
