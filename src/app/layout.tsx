import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import CartProvider from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Jamaican Jerk House | Kingston-Style Jerk in New Orleans & Metairie",
    template: "%s | Jamaican Jerk House",
  },
  description: site.description,
  // Previews stay out of search until the client signs.
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    siteName: site.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Jamaican Jerk House logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#16130F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <ScrollToTop />
        </CartProvider>
      </body>
    </html>
  );
}
