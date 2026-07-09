import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";


export const metadata: Metadata = {
  title: "AI-ассистент команды",
  description: "Внутренний AI-ассистент команды на Next.js и FastAPI.",
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
