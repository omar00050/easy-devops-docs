import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "./globals.css";

const SITE_URL = "https://easy-devops.devxor.team/";
const OG_IMAGE = "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/docs/public/og-image.png";
const SITE_NAME = "Easy DevOps";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Easy DevOps — Unified DevOps CLI for Nginx, SSL & Node.js",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A unified DevOps management tool with interactive CLI and web dashboard. Manage Nginx, Let's Encrypt SSL/TLS certificates (HTTP-01 & DNS-01), domain configs, and Node.js versions on Linux and Windows. Open source, free, and lightweight.",
  keywords: [
    "DevOps",
    "DevOps tool",
    "DevOps CLI",
    "unified DevOps",
    "Nginx management",
    "SSL certificate management",
    "Let's Encrypt CLI",
    "acme-client",
    "HTTP-01",
    "DNS-01",
    "wildcard SSL",
    "Node.js version manager",
    "reverse proxy config",
    "server management tool",
    "open source DevOps",
    "free DevOps CLI",
    "Nginx config editor",
    "SSL/TLS automation",
    "certificate management",
    "production server setup",
    "Easy DevOps",
    "easy-devops",
  ],
  authors: [{ name: "Omar Farghaly", url: "https://farghaly.dev" }],
  creator: "Omar Farghaly",
  publisher: "Easy DevOps",
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Easy DevOps — Unified DevOps CLI for Nginx, SSL & Node.js",
    description:
      "Manage Nginx, SSL certificates, domains, and Node.js versions from a single interactive CLI or modern web dashboard. Open source and lightweight.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Easy DevOps — Unified DevOps CLI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy DevOps — Unified DevOps CLI for Nginx, SSL & Node.js",
    description:
      "Manage Nginx, SSL certificates, domains, and Node.js from one open-source CLI and web dashboard.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
  icons: {
    icon: "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/src/dashboard/public/img/icon_b.png",
    shortcut: "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/src/dashboard/public/img/icon_b.png",
    apple: "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/src/dashboard/public/img/icon_b.png",
  },
  category: "Developer Tool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // TODO: replace with your GA4 measurement ID
                if (GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;
                var s = document.createElement('script');
                s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
                s.async = true;
                document.head.appendChild(s);
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', GA_MEASUREMENT_ID);
              })();
            `,
        }}
      />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: SITE_NAME,
              description:
                "A unified DevOps management tool with interactive CLI and web dashboard for managing Nginx, SSL certificates, and Node.js on Linux and Windows servers.",
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              operatingSystem: ["Linux", "Windows"],
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              license: "https://opensource.org/licenses/MIT",
              author: {
                "@type": "Person",
                name: "Omar Farghaly",
                url: "https://farghaly.dev",
              },
              image: "https://raw.githubusercontent.com/omar00050/Easy-DevOps/main/src/dashboard/public/img/icon_b.png",
              softwareVersion: "1.0.0",
            }),
          }}
        />
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
