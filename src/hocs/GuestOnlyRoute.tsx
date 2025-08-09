'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Type Imports
import type { ChildrenType } from '@core/types';
import type { Locale } from '@configs/i18n';

// Config Imports
import themeConfig from '@configs/themeConfig';

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n';
import { ToastContainer } from 'react-toastify';

const GuestOnlyRoute = ({ children, lang }: ChildrenType & { lang: Locale }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      router.replace(getLocalizedUrl(themeConfig.homePageUrl, lang));
    } else {
      setLoading(false);
    }
  }, []);

  return <>
  <ToastContainer />
  {children}
  </>;
};

export default GuestOnlyRoute;
