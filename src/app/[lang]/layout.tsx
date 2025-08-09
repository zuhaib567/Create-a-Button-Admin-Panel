// Next Imports
import { headers } from 'next/headers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports

// HOC Imports
import NextTopLoader from 'nextjs-toploader'
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Create A Button - Admin Pannel',
  description:
    'Create A Button is a powerful admin panel template built with Next.js and MUI, designed to streamline your web application development.'
}

const RootLayout = ({ children, params }: ChildrenType & { params: { lang: Locale } }) => {
  // Vars
  const headersList = headers()
  const direction = i18n.langDirection[params.lang]

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction}>
        <head>
          <link rel='icon' href='/favicon.png' />
        </head>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <NextTopLoader color='#675DD8' showSpinner={false} />
          {children}
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
