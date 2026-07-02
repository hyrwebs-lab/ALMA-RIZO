import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import Prose from "@/components/site/Prose";
import { legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad y protección de datos de Alma Rizo · Curly Studio.",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <>
      <PageHero eyebrow="Información legal" title="Política de privacidad" />
      <Prose>
        <h2>Responsable del tratamiento</h2>
        <p>
          {legal.ownerName} ({legal.tradeName}), con NIF/CIF {legal.nif} y
          domicilio en {legal.addressFull}, es responsable del tratamiento de tus
          datos personales. Puedes contactarnos en {legal.email}.
        </p>

        <h2>¿Qué datos recogemos y con qué finalidad?</h2>
        <p>Tratamos los datos que nos facilitas a través de:</p>
        <ul>
          <li><strong>Formulario de contacto:</strong> nombre, email, teléfono y mensaje, para atender tu consulta.</li>
          <li><strong>Sistema de reservas:</strong> nombre, teléfono, email y notas sobre tu cabello, para gestionar tu cita.</li>
        </ul>

        <h2>Legitimación</h2>
        <p>
          La base legal es tu consentimiento al enviarnos tus datos y la
          ejecución de la relación de servicio (gestión de la cita solicitada).
        </p>

        <h2>Conservación</h2>
        <p>
          Conservaremos tus datos durante el tiempo necesario para atender tu
          solicitud y, posteriormente, durante los plazos legalmente exigidos.
          Después serán suprimidos.
        </p>

        <h2>Destinatarios</h2>
        <p>
          No cedemos tus datos a terceros salvo obligación legal. Podemos usar
          proveedores tecnológicos (alojamiento, herramientas de gestión) que
          actúan como encargados del tratamiento con las debidas garantías.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión,
          oposición, limitación y portabilidad escribiendo a {legal.email},
          indicando el derecho que deseas ejercer. También puedes reclamar ante la
          Agencia Española de Protección de Datos (www.aepd.es).
        </p>

        <p className="!mt-10 text-sm text-ink-soft/70">
          Documento pendiente de completar con los datos definitivos del negocio.
        </p>
      </Prose>
    </>
  );
}
