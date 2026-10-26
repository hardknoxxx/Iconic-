import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Catalog } from "@/components/Catalog";
import { Brand } from "@/components/Brand";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Brand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
