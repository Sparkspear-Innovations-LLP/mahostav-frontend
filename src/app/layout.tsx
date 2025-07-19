import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Using the actual Samarkan font file
const samarkan = localFont({
  src: [
    {
      path: "./fonts/Samarkan-Normal.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-samarkan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahostav",
  description: "Celebrating culture and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${samarkan.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
