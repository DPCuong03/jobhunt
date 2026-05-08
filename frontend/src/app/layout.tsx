import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "Job Hunt",
  description: "Find your dream job",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workSans.variable} h-full antialiased`}>
      <head>
        <link rel="stylesheet" href="/dist-front/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/dist-front/css/animate.min.css" />
        <link rel="stylesheet" href="/dist-front/css/magnific-popup.css" />
        <link rel="stylesheet" href="/dist-front/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/dist-front/css/select2.min.css" />
        <link
          rel="stylesheet"
          href="/dist-front/css/select2-bootstrap.min.css"
        />
        <link rel="stylesheet" href="/dist-front/css/all.css" />
        <link rel="stylesheet" href="/dist-front/css/meanmenu.css" />
        <link rel="stylesheet" href="/dist-front/css/iziToast.min.css" />
        <link rel="stylesheet" href="/dist-front/css/spacing.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
