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
  title: "JUMVI | Play. Learn. Move.",
  description: "Premium active play kit with QR missions for kids.",
  keywords: ["JUMVI", "kids play kit", "QR missions", "active play", "gift", "ages 3-8"],
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
    title: "JUMVI | Play. Learn. Move.",
    description: "Premium active play kit with QR missions for kids.",
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
    title: "JUMVI | Play. Learn. Move.",
    description: "Premium active play kit with QR missions for kids.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
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
