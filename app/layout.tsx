import type { Metadata } from "next";
import { Inter, Audiowide, Asul, Exo_2 } from "next/font/google";
import "./globals.css";
import { PrivyAuthProvider } from "@/components/providers/PrivyAuthProvider";
import AntdConfigProvider from "@/components/providers/AntdConfigProvider";

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

const exo2 = Exo_2({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-exo2",
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
      <body className={`${inter.className} ${audiowide.variable} ${asul.variable} ${exo2.variable} antialiased`}>
        <AntdConfigProvider>
          <PrivyAuthProvider>
            {children}
          </PrivyAuthProvider>
        </AntdConfigProvider>
      </body>
    </html>
  );
}
