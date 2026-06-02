import type { Metadata, Viewport } from "next";
import { Montserrat, Source_Sans_3, Fira_Code } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { AuthProvider } from "@/hooks/useAuth";
import SchemaScript from "@/components/ui/SchemaScript";
import "./globals.css";
import PromoBanner from "@/components/ui/PromoBanner";

// ============ FONTS ============
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-source-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fira-code",
  display: "swap",
});

// ============ SITE CONFIG ============
const SITE_URL = process.env.NEXTAUTH_URL || "https://cryptoelectro-au.vercel.app";
const SITE_NAME = "Cryptoelectro-au";
const SITE_DESCRIPTION =
  "Australia's premium electronics marketplace with cryptocurrency payments. Shop smartphones, laptops, cameras, gaming consoles, and home appliances with Bitcoin, Ethereum, USDT, and 100+ cryptocurrencies.";
const SITE_KEYWORDS = [
  "electronics",
  "Australia",
  "crypto payments",
  "smartphones",
  "laptops",
  "cameras",
  "gaming consoles",
  "home appliances",
  "Bitcoin",
  "Ethereum",
  "USDT",
  "buy electronics with crypto",
  "crypto ecommerce Australia",
];

// ============ VIEWPORT ============
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0A",
};

// ============ METADATA ============
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Electronics Marketplace`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
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
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Electronics Marketplace`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_AU",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cryptoelectro-au",
    creator: "@cryptoelectro-au",
    title: `${SITE_NAME} | Premium Electronics Marketplace`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  verification: { google: "your-google-verification-code" },
  category: "ecommerce",
  creator: "Cryptoelectro-au",
  publisher: "Cryptoelectro-au",
  formatDetection: { email: false, address: false, telephone: false },
};

// ============ SCHEMAS JSON-LD (sans dangerouslySetInnerHTML) ============
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    "https://twitter.com/cryptoelectroau",
    "https://www.facebook.com/share/1D58ZZsbhk/",
    "https://instagram.com/cryptoelectroau",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "1300-123-456",
    contactType: "customer service",
    areaServed: "AU",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// ============ ROOT LAYOUT ============
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://api.nowpayments.io" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://api.nowpayments.io" />
      </head>
      <body
        className={`${montserrat.variable} ${sourceSans.variable} ${firaCode.variable} antialiased min-h-screen flex flex-col`}
      >
        <SchemaScript schema={organizationSchema} />
        <SchemaScript schema={websiteSchema} />
        <PromoBanner />
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}