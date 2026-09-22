import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AIAssistant from "@/components/AIAssistant";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "AUREVEX | Work Intelligence",
  description: "Persistent memory for engineering teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable} dark`}>
      <body className="bg-background text-textMain antialiased flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative">
          {children}
          <AIAssistant />
        </main>
      </body>
    </html>
  );
}
