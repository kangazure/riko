import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/sections/footer";
import "./globals.css";
import "./custom.css";
import InteractiveBackground from "@/components/background/InteractiveBackground";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rikoardianto.web.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Riko Ardianto — Cyber Security",
    template: "%s — Riko Ardianto",
  },
  description:
    "Cybersecurity enthusiast yang fokus pada riset keamanan, web security, Linux, dan membangun hal-hal yang berfungsi.",
  keywords: ["cyber security", "web security", "security research", "linux", "Riko Ardianto"],
  authors: [{ name: "Riko Ardianto" }],
  creator: "Riko Ardianto",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Riko Ardianto",
    title: "Riko Ardianto — Cyber Security",
    description:
      "Cybersecurity enthusiast yang fokus pada riset keamanan, web security, Linux, dan membangun hal-hal yang berfungsi.",
    locale: "id_ID",
    images: [{ url: `${siteUrl}/images/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riko Ardianto — Cyber Security",
    description:
      "Cybersecurity enthusiast focused on security research, web security, Linux, and building things that work.",
    images: [`${siteUrl}/images/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/icons/favicon.svg",
    shortcut: "/icons/favicon.svg",
    apple: "/icons/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-[100dvh] font-sans antialiased">
        <ThemeProvider>
          <div className="relative flex min-h-[100dvh] flex-col">
            <InteractiveBackground />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
