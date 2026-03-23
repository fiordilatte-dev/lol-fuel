import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FuelWatch Australia — Live Fuel Prices & Crisis Tracker",
  description:
    "Real-time Australian fuel prices by state. National averages, satirical commentary, and the data you need to cry at the bowser.",
  openGraph: {
    title: "FuelWatch Australia",
    description: "Live fuel prices. Political satire. National tears.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] antialiased">
        {children}
      </body>
    </html>
  );
}
