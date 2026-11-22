import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin", "cyrillic"],
});

const title = "NoteHub";
const description =
  "NoteHub is a simple and efficient application for managing personal notes.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: SITE_URL,
    images: [OG_IMAGE],
  },
};

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const RootLayout = ({ children, modal }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
};

export default RootLayout;
