import "../styles/globals.css";
import { BasketProvider } from "../components/layout/BasketContext";
import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";
import SiteWrapper from "../components/layout/SiteWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BasketProvider>
          <SiteWrapper>
            <SiteHeader />
            {children}
            <SiteFooter />
          </SiteWrapper>
        </BasketProvider>
      </body>
    </html>
  );
}
