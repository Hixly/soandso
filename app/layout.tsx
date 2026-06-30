import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soandso-orcin.vercel.app"),
  title: "So&So — Not a smarter AI. Yours.",
  description:
    "A personal AI you shape in under two minutes with sliders, not prompts. It remembers what matters and sounds like you. Not a smarter AI — yours.",
  openGraph: {
    title: "So&So — Not a smarter AI. Yours.",
    description:
      "Shape a personal AI with sliders, not prompts. It remembers you and sounds like you.",
    url: "/",
    siteName: "So&So",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "So&So — Not a smarter AI. Yours.",
    description:
      "Shape a personal AI with sliders, not prompts. It remembers you and sounds like you.",
  },
  appleWebApp: {
    capable: true,
    title: "So&So",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAEBD7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
