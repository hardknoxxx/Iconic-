import { Header } from "@/components/Header";
import { HeroScene } from "@/components/HeroScene";
import { Catalog } from "@/components/Catalog";
import { Brand } from "@/components/Brand";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroScene />
        <Catalog />
        <Brand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
