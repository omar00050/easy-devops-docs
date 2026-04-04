import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: true,
});

export const metadata: Metadata = {
  title: "Easy DevOps — Unified DevOps CLI",
  description: "A unified DevOps management tool with interactive CLI and web dashboard for managing Nginx, SSL certificates, and Node.js on Linux and Windows servers.",
  icons: {
    icon: "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/dashboard/public/img/icon_b.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme') || 'dark';
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} antialiased`} style={{ fontFamily: 'var(--font-inter)' }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
