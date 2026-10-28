import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Collection } from "@/components/Collection";
import { Brand } from "@/components/Brand";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Collection />
        <Brand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
