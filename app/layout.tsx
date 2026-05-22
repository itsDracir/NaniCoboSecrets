import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import SmoothScrollProvider from "./providers/SmoothScrollProvider";
import Header from "@/components/nav/Header";
import "./globals.css";

// Display serif — elegant, editorial, luxury beauty feel.
const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Body sans — clean, modern, premium.
const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nanicobosecrets.com"),
  title: {
    default: "NaniCobo Secrets — HYDRA · Hidratación capilar premium",
    template: "%s · NaniCobo Secrets",
  },
  description:
    "Línea HYDRA de NaniCobo Secrets: hidratación transformadora para un cabello brillante y lleno de vida. Reconstruye, hidrata y protege con cuidado capilar premium.",
  keywords: [
    "NaniCobo Secrets",
    "HYDRA",
    "cuidado capilar premium",
    "hidratación cabello",
    "cabello rizado",
    "leave-in",
    "tratamiento capilar",
    "luxury haircare",
  ],
  authors: [{ name: "NaniCobo Secrets" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "NaniCobo Secrets",
    title: "NaniCobo Secrets — HYDRA · Hidratación capilar premium",
    description:
      "Hidratación transformadora para un cabello brillante y lleno de vida. Descubre la línea HYDRA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NaniCobo Secrets — HYDRA",
    description:
      "Hidratación transformadora para un cabello brillante y lleno de vida.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
          <Header />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </body>
    </html>
  );
}
