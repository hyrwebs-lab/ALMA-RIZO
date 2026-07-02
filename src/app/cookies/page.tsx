import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import Prose from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Información sobre el uso de cookies en Alma Rizo · Curly Studio.",
  robots: { index: false },
};

export default function CookiesPage() {
  return (
    <>
      <PageHero eyebrow="Información legal" title="Política de cookies" />
      <Prose>
        <h2>¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos que se descargan en tu dispositivo al
          navegar por una web y permiten, entre otras cosas, recordar tus
          preferencias o mostrar contenido de terceros.
        </p>

        <h2>¿Qué cookies utiliza esta web?</h2>
        <ul>
          <li><strong>Técnicas / necesarias:</strong> imprescindibles para el funcionamiento del sitio (por ejemplo, recordar que ya has aceptado este aviso). No requieren consentimiento.</li>
          <li><strong>De terceros:</strong> al mostrar el mapa de Google Maps, Google puede instalar sus propias cookies. Su uso se rige por la política de privacidad de Google.</li>
        </ul>
        <p>
          Actualmente <strong>no utilizamos cookies de analítica ni de
          publicidad</strong>. Si en el futuro se incorporan, se actualizará esta
          política y se solicitará tu consentimiento.
        </p>

        <h2>¿Cómo gestionar las cookies?</h2>
        <p>
          Puedes permitir, bloquear o eliminar las cookies instaladas en tu
          equipo configurando las opciones de tu navegador (Chrome, Firefox,
          Safari, Edge…).
        </p>

        <p className="!mt-10 text-sm text-ink-soft/70">
          Documento a revisar si se añaden herramientas de analítica (por ejemplo,
          Google Analytics o Meta Pixel).
        </p>
      </Prose>
    </>
  );
}
