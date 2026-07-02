# Alma Rizo · Curly Studio — Entrega (versión demo funcional)

Web + sistema de reservas + panel de administración con roles. Lista para
**enseñársela a la dueña** y demostrar cómo funciona.

---

## 1. Cómo arrancarla

```bash
cd alma-rizo
npm install      # solo la primera vez
npm run dev      # abre http://localhost:3000
```

La web pública funciona sin configurar nada. Las reservas y el panel funcionan
en **modo demostración** (los datos se guardan en el navegador; en producción se
conectan a la base de datos real — Supabase).

---

## 2. Cómo enseñárselo a la dueña (guion de demo)

1. **Web pública** → recorre la home: hero, “si tu rizo no define…”, qué hacemos,
   los 3 servicios, antes/después (deslizable), sobre mí, reseñas (carrusel solo
   con 4,5★+), mapa y “reserva tu cita”. Enseña el botón flotante de WhatsApp.
2. **Hacer una reserva** → botón *Reservar* → elige servicio, estilista, fecha y
   hora, datos y confirma. Aparece la pantalla de éxito **con el vídeo “cómo
   venir preparada”**.
3. **Panel admin** → ve a `tudominio/admin` (o el enlace *Acceso equipo* del pie).
   Entra como **Dueña** y enséñale que **la reserva que acabas de hacer ya está
   ahí**. Cambia el estado a “Confirmada”.
4. **Roles** → sal y entra como **Trabajadora**: solo ve las reservas. Entra como
   **Admin técnico**: lo ve todo, incluida la pestaña *Usuarios y roles*.

### Accesos del panel (demo)

| Rol | Email | Contraseña | Qué puede hacer |
|-----|-------|-----------|--------|
| **Superadmin** (Héctor/Raúl) | `admin@almarizo.com` | `admin` | Todo, incluido usuarios, roles y configuración técnica |
| **Dueña** (Maricruz) | `maricruz@almarizo.com` | `alma` | Editar la web: servicios y precios, antes/después, reseñas, galería, **trabajadores**, datos de contacto + agenda |
| **Trabajadora** | `equipo@almarizo.com` | `equipo` | **Solo la agenda**: ver, añadir y modificar citas |

> En la pantalla de login hay botones de acceso rápido para no escribir nada.
> La parte de **editar la web y los trabajadores** solo la ven la Dueña y el
> Superadmin; las demás trabajadoras solo entran a la agenda.

---

## 3. Lo que le tienes que decir que NOS FALTA (para terminarla)

Todo lo que falta está puesto con **material de ejemplo claramente marcado** para
que la web se vea acabada. Esto es lo que hay que pedirle a la dueña:

> ✅ **Ya integradas las 8 fotos reales** que nos pasó: el par antes/después del
> corte+color, la transformación afro, y las del método (diagnóstico, definición,
> elasticidad, proteína). La web ya va con fotografía real en color.

### 🔴 Imprescindible
1. **Precios y duración reales de los servicios.** Ahora hay de ejemplo: Método
   Alma Rizo 75 €/2 h · Corte Curly 45 €/1 h 15 · Ritual 60 €/1 h 30 ·
   Diagnóstico 25 €/45 min · Hidratación 40 €/1 h. **¿Cuáles son los reales? ¿Hay
   más servicios?**
2. **Reseñas reales** (texto + nombre). Ahora hay 6 de ejemplo. O permiso para
   coger las de Google. *Solo se muestran las de 4,5★ o más.*
3. **Confirmar la foto de Maricruz**: hemos puesto la del salón (la rizada rubia
   de pie) en “Sobre mí”. **¿Es Maricruz?** Si tiene un **retrato suyo a solas**
   quedaría aún mejor.

### 🟡 Importante
4. **Vídeo del banner (portada)**: el carrusel de inicio está preparado para un
   **vídeo de Instagram** de fondo. Cuando lo envíen, se coloca en
   `/public/videos/portada.mp4` y al pulsarlo lleva a su Instagram.
5. **Fotos y precios reales de los productos** (ahora champú/acondicionador/
   crema/mascarilla con fotos e importes de ejemplo).
6. **Correo electrónico** del negocio (ahora `hola@almarizo.com` de ejemplo).
7. **Redes**: Instagram ya puesto (`@mimasbymaricruz`, su cuenta real). **Confirmar
   TikTok** (he puesto `@mimasbymaricruz`) y **pasar Facebook** si tienen.
8. **Número de WhatsApp Business** real.
9. **Vídeo “cómo venir preparada”** (archivo o enlace de YouTube/IG/TikTok). Se
   enseña justo después de reservar.

### 🟢 Deseable
8. **Más pares antes/después**, a ser posible con la **misma pose** antes y
   después (así se puede usar también el comparador deslizante).
9. **Ficha de Google Maps**: confirmar que se renombra de “Mimas by Mari Cruz” a
   “Alma Rizo” (la web ya va toda como **Alma Rizo**).
10. **Horario de domingo** (asumido cerrado) y festivos.
11. **Nombres reales de las trabajadoras** (ahora Maricruz + “Lucía (ejemplo)”).

---

## 4. Notas técnicas (para vosotros, no para la dueña)

- **Stack:** Next.js 16 + TypeScript + Tailwind v4. Imágenes y logos reales en
  `/public`. Todo el contenido editable en `src/lib/site.ts`.
- **Hosting:** pensado para **Vercel + Supabase** (no el hosting básico de
  Hostinger). El dominio se puede apuntar sin problema.
- **Modo demo:** reservas/panel usan `localStorage` (`src/lib/store.ts`) para que
  funcione sin backend. **Siguiente fase:** conectar a Supabase para datos
  persistentes, login real y multiusuario.
- Cada hueco con material de ejemplo está marcado con `⚠️ PLACEHOLDER` en
  `src/lib/site.ts` y con etiquetas visibles en la web.
