// src/app/(main)/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FooterBottom from "@/components/FooterBottom";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FooterBottom />
      <div className="scroll-top">
        <i className="fas fa-angle-up"></i>
      </div>
    </>
  );
}
