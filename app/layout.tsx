import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JUMVI | Oyna. Öğren. Hareket et.",
  description: "QR görevleriyle premium aktif oyun kiti. Çocuklar için hareketli, ekransız oyun.",
  keywords: ["JUMVI", "çocuk oyun kiti", "QR görev", "aktif oyun", "hediye", "3-8 yaş"],
  metadataBase: new URL("https://jumvi.co"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "JUMVI | Oyna. Öğren. Hareket et.",
    description: "QR görevleriyle premium aktif oyun kiti. Çocuklar için hareketli, ekransız oyun.",
    type: "website",
    siteName: "JUMVI",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "JUMVI Oyun Kiti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JUMVI | Oyna. Öğren. Hareket et.",
    description: "QR görevleriyle premium aktif oyun kiti.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="font-sans">
        <Analytics />
        <main>{children}</main>
      </body>
    </html>
  );
}
