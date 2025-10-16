import type { Metadata } from "next";
import { Geist, Geist_Mono, Parkinsans } from "next/font/google";
import { AuthProvider } from "@/hooks/use-supabase-auth";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "MAHWA 2006 - AI-Powered Memory Management",
  description: "AI-powered system designed to streamline memory management and handle automation tasks for the MAHWA 2006 community.",
  keywords: ["AI Agent", "Memory Management", "Automation", "MAHWA 2006", "Community"],
  openGraph: {
    title: "MAHWA 2006",
    description: "Track, manage, and optimize community memories with AI automation",
    url: "/",
    height: 630,
    images: [
      {
        url: "/api/placeholder/1200/630",
        width: 1200,
        height: 630
      },
    ],
    locale: "en_US",
    type: "website",
    siteName: "MAHWA 2006",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parkinsans.variable} antialiased`}
      >
        <div className="isolate">
          <ErrorBoundary>
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster />
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
