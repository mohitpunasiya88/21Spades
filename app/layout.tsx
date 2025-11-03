import type { Metadata } from "next";
import { Inter, Audiowide, Asul } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
});

const asul = Asul({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-asul",
});

export const metadata: Metadata = {
  title: "21 SPADES - Social Exchange",
  description: "Connect, Create & Trade in the WEB3 World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${audiowide.variable} ${asul.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
