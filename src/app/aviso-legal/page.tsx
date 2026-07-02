import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import Prose from "@/components/site/Prose";
import { legal, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de Alma Rizo · Curly Studio.",
  robots: { index: false },
};

export default function AvisoLegalPage() {
  return (
    <>
      <PageHero eyebrow="Información legal" title="Aviso legal" />
      <Prose>
        <h2>Titular del sitio web</h2>
        <p>
          En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSI-CE), se informa de los
          siguientes datos:
        </p>
        <ul>
          <li><strong>Titular:</strong> {legal.ownerName}</li>
          <li><strong>Nombre comercial:</strong> {legal.tradeName}</li>
          <li><strong>NIF/CIF:</strong> {legal.nif}</li>
          <li><strong>Domicilio:</strong> {legal.addressFull}</li>
          <li><strong>Correo electrónico:</strong> {legal.email}</li>
          <li><strong>Teléfono:</strong> {site.contact.phone}</li>
          <li><strong>Actividad:</strong> {legal.activity}</li>
        </ul>

        <h2>Condiciones de uso</h2>
        <p>
          El acceso y uso de este sitio web atribuye la condición de usuario e
          implica la aceptación de las presentes condiciones. El usuario se
          compromete a hacer un uso adecuado de los contenidos y a no emplearlos
          para actividades ilícitas o contrarias a la buena fe.
        </p>

        <h2>Propiedad intelectual e industrial</h2>
        <p>
          Todos los contenidos de este sitio web (textos, imágenes, logotipos,
          diseño y código) son titularidad de {legal.tradeName} o de terceros que
          han autorizado su uso, y están protegidos por la normativa de propiedad
          intelectual e industrial. Queda prohibida su reproducción sin
          autorización.
        </p>

        <h2>Responsabilidad</h2>
        <p>
          {legal.tradeName} no se hace responsable de los daños derivados del uso
          del sitio ni de la información contenida en páginas de terceros
          enlazadas desde este sitio.
        </p>

        <h2>Legislación aplicable</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para
          cualquier controversia, las partes se someten a los juzgados y
          tribunales que correspondan conforme a derecho.
        </p>

        <p className="!mt-10 text-sm text-ink-soft/70">
          Documento pendiente de completar con los datos definitivos del negocio
          (razón social y NIF).
        </p>
      </Prose>
    </>
  );
}
