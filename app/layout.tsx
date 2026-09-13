import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "ROBOMATCH - Generator Pairing & Heat Perlombaan Robot",
  description: "Aplikasi web pengacak pasangan tanding (pairing) perlombaan robotik dengan penanganan tim ganjil (BYE), kartu visual, tabel heat, dan ekspor ke Excel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" class="dark">
      <body
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} font-sans min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
