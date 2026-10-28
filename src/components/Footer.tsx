import Image from "next/image";
import { AnchorLink } from "./AnchorLink";
import { Reveal } from "./Reveal";

/**
 * Cierre de la página: solo el logo, grande y con aire. Los datos de contacto, la dirección
 * y los medios de pago ya están en la sección «Contacto»; repetirlos acá era ruido.
 * El logo vuelve al inicio, que es lo único que un cierre así tiene que ofrecer.
 * `unoptimized`: es un PNG con transparencia ya dimensionado; el optimizador de Next lo
 * convertía a una paleta que dibujaba un halo gris bajo las letras.
 */
export function Footer() {
  return (
    <footer data-nav="" className="on-dark border-t border-white/20 bg-ink">
      <div className="mx-auto flex min-h-[60svh] items-center justify-center px-4 py-20 md:min-h-[70svh] md:py-32">
        <Reveal className="reveal-slow">
          <AnchorLink
            href="#inicio"
            ariaLabel="ICONIC, volver al inicio"
            className="block transition-opacity duration-500 ease-[var(--ease-out-strong)] hover:opacity-70 focus-visible:opacity-100"
          >
            <Image
              src="/brand/logo-light-xl.png"
              alt=""
              unoptimized
              width={2000}
              height={815}
              sizes="(min-width: 1024px) 46rem, 78vw"
              className="h-auto w-[min(78vw,46rem)]"
            />
          </AnchorLink>
        </Reveal>
      </div>
    </footer>
  );
}
