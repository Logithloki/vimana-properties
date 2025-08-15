import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { PropertyProvider } from '@/contexts/PropertyContext';
import ToastContainer from '@/components/ToastContainer';

// Houschka font is loaded via CSS in fonts.css

export const metadata: Metadata = {
  title: "Vimana Properties",
  description: "Find your dream home with our Vimana Properties platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen flex flex-col font-houschka"
      >
        <ToastProvider>
          <PropertyProvider>
            <FavoritesProvider>
              <ComparisonProvider>
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <ToastContainer />
              </ComparisonProvider>
            </FavoritesProvider>
          </PropertyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
