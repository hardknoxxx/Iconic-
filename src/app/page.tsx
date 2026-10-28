import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Collection } from "@/components/Collection";
import { Lookbook } from "@/components/Lookbook";
import { Brand } from "@/components/Brand";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { GsapScroll } from "@/components/GsapScroll";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Collection />
        <Lookbook />
        <Brand />
        <Contact />
      </main>
      <Footer />
      {/* Va al final a propósito: sus efectos corren cuando todo lo anterior ya se hidrató, y GSAP escribe estilos en ese marcado. */}
      <GsapScroll />
    </>
  );
}
