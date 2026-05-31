import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baitul Huffaz - Sistem Manajemen Hafalan Al-Qur'an",
  description: "Aplikasi manajemen lembaga tahfizh Al-Qur'an Baitul Huffaz",
  keywords: ["tahfizh", "al-quran", "hafalan", "islam", "pendidikan"],
  authors: [{ name: "Baitul Huffaz" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
