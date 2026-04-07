import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import InitAuth from '@/components/layout/InitAuth';
import Chatbot from '@/components/chatbot/Chatbot';
import I18nProvider from '@/components/layout/I18nProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plateforme Debat Haiti',
  description: 'Formation au debat et competitions en live',
  manifest: '/manifest.json',
  themeColor: '#1e3a5f',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Debat Haiti',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a5f" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'fr',
                  includedLanguages: 'fr,ht,en',
                  autoDisplay: false,
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
        />
      </head>
        <body className={inter.className} suppressHydrationWarning>
        <div id="google_translate_element" style={{ display: 'none' }} suppressHydrationWarning />
        <I18nProvider>
          <InitAuth />
          <Navbar />
          <main style={{ minHeight: '100vh', background: '#f8fafc', overflowX: 'hidden' }}>
            {children}
          </main>
          <Chatbot />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#1e3a5f', color: '#fff' },
            }}
          />
        </I18nProvider>
      </body>
    </html>
  );
}