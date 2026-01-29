import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/providers/ConvexClientProvider'
import { ToastProvider } from '@/components/providers/toaster-provider'
import Navbar from "@/components/Navbar";

// Skip static generation for root layout to avoid Clerk initialization issues during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keek institute",
  description: "Discover your perfect tech career path with Keek instituteeee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider 
          afterSignOutUrl="/" 
          signInUrl="/signup" 
          signUpUrl="/signup"
          signUpFallbackRedirectUrl="/dashboard"
        >
          <ConvexClientProvider>
            <ToastProvider />
            <Navbar />
            <main>
              {children}
            </main>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

