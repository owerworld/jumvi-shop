import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plus",
});

export const metadata: Metadata = {
  title: "JUMVI | Oyna. Ogren. Hareket et.",
  description: "QR gorevleriyle premium aktif oyun kiti.",
  metadataBase: new URL("https://jumvi.com"),
  openGraph: {
    title: "JUMVI | Oyna. Ogren. Hareket et.",
    description: "QR gorevleriyle premium aktif oyun kiti.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans">
        <Analytics />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
