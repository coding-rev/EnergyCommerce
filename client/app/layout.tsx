import "../styles/globals.css";
import { BasketProvider } from "../components/layout/BasketContext";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BasketProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </BasketProvider>
      </body>
    </html>
  );
}
