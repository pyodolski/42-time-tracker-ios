import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import PWAInstaller from '@/components/PWAInstaller';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TimeTracker',
  description: '시간 추적 및 근무 계획 관리 애플리케이션',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TimeTracker',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'TimeTracker',
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#3b82f6',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-4">
              {children}
            </main>
            <PWAInstaller />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
