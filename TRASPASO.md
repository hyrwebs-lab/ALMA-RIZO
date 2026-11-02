# Traspaso del proyecto — Alma Rizo

> Documento para retomar el trabajo desde otro ordenador sin perder contexto.
> Última actualización: **2 de noviembre de 2026**.

## 1. Qué es esto

Web + panel de gestión para **Alma Rizo · Curly Studio by MariCruz**, peluquería
especializada en cabello rizado en Tarragona. Proyecto de pago (1.200 € + 300 €/año
de mantenimiento). Lo desarrollan Héctor y Raúl.

- **Web en vivo:** https://almarizo.com
- **Panel de gestión:** https://almarizo.com/admin
- **Repositorio:** `hyrwebs-lab/ALMA-RIZO` (rama `master`)
- **Hosting:** Vercel — proyecto `alma-rizo`, cuenta/scope `hy-r`
- **Base de datos:** Turso (libSQL). En local se usa un fichero SQLite que se crea solo.

## 2. Estado actual: la web está terminada y funcionando

Verificado en producción: portada, servicios y galería responden correctamente,
las reservas funcionan y el panel guarda cambios que se ven en la web.

### Lo que ya está hecho
- Web pública completa: portada con banner de 3 vídeos verticales, método,
  servicios con precios reales, antes/después, sobre mí, reseñas, muro de reels,
  marcas, contacto y páginas legales.
- **Las reservas se piden por WhatsApp**: la web ya no da hora. Todos los botones
  de «Reservar» abren WhatsApp con el mensaje escrito (y el servicio, si se pulsa
  desde una ficha), y `/reservar` es una página de contacto —el QR del escaparate
  apunta ahí—. Las citas se apuntan en el panel, que sigue bloqueando las dobles
  reservas (índice único + control de solapamiento por duración).
- **Panel de gestión** con 3 roles (superadmin / dueña / trabajadora) y agenda tipo
  calendario por trabajadora, con recordatorio manual por WhatsApp de un toque.
- **Todo lo que se edita en el panel sale en la web**: servicios, antes/después,
  novedades, reseñas, galería, trabajadores y datos de contacto.
- Identidad visual según la guía de marca, con el verde salvia `#688b5e` que eligió
  la clienta.
- Teléfono de empresa +34 629 48 76 14 (sustituyó al fijo) y aviso de WhatsApp.
- Redes destacadas: Instagram de Maricruz, TikTok e Instagram del salón.

## 3. Lo que queda pendiente

| Pendiente | Estado |
|---|---|
| **Cambios que pidió la clienta a finales de agosto** | ⚠️ Sin hacer — es lo primero |
| Vídeos de transformaciones reales (los tiene Génnesis) | Falta el material |
| URL del reel de Instagram de cada vídeo | Falta; ahora casi todos van al perfil |
| Más fotos de casos reales (solo hay 2 antes/después) | Falta el material |
| Avisos automáticos al entrar una reserva | Ya no aplica: la reserva llega por WhatsApp |
| Cobro del proyecto | Pendiente |

**Importante sobre las reservas:** la clienta pidió que la web **no diera hora** y
que todo pasara por WhatsApp, así que el asistente de 5 pasos y el calendario se
han quitado. La dueña cierra la cita por WhatsApp y la apunta en el panel, donde
sigue teniendo el recordatorio de un toque. Así también se resuelve lo de que
nadie recibía aviso al entrar una reserva.

## 4. Montar el proyecto en el ordenador nuevo

```bash
git clone https://github.com/hyrwebs-lab/ALMA-RIZO.git alma-rizo
cd alma-rizo
npm install
npm run dev
```

Con eso ya funciona en local: la base de datos SQLite se crea sola con contenido de
ejemplo en `data/almarizo.db`. **No hace falta ningún fichero `.env` para trabajar en
local** (las credenciales de Turso solo viven en Vercel).

### Para poder publicar cambios
- **GitHub:** al primer `git push` se abrirá una ventana para iniciar sesión.
  Cada push a `master` despliega solo en Vercel (~1 minuto).
- **Vercel CLI** (opcional, solo si quieres desplegar a mano o tocar variables):
  `npm i -g vercel`, luego `vercel login` (te da un código para el navegador) y
  `vercel link` eligiendo el proyecto `alma-rizo`.

### Lo que NO viaja en el repositorio
- `media-src/` → vídeos originales en bruto (146 MB). **Solo hacen falta si hay que
  volver a comprimir vídeos.** Los ya optimizados sí están en `public/videos/`.
- `data/almarizo.db` → base de datos local; se regenera sola.
- `.vercel/` → enlace con Vercel; se recrea con `vercel link`.

### Contraseñas
No se guardan en el repositorio. Las del panel están en la guía que se entregó a la
clienta (`GUIA-DE-USO.pdf`) y en las notas privadas del proyecto.

## 5. Detalles técnicos útiles

- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind v4 + `@libsql/client`.
- **Colores de marca** en `src/app/globals.css` (bloque `@theme`).
- **Datos de contacto:** `src/lib/site.ts` tiene los valores de fábrica; lo que la
  dueña guarda en el panel los sobrescribe (`mergeContact`). El layout los lee de la
  base de datos y los reparte con `src/lib/contact.tsx`.
- **Reservas:** la web solo enlaza a WhatsApp —`src/components/site/ReservarButton.tsx`
  con el mensaje de `src/lib/booking.ts`— y la página `/reservar` es
  `src/components/reservar/ReservarWhatsApp.tsx`. En el panel siguen vivos
  `createReservation` y `slotsForDate` de `src/lib/db.ts` para dar de alta citas.
- **Migraciones:** en `initDb` de `src/lib/db.ts` hay migraciones que se aplican
  solas al arrancar (columna `news.image` y refresco de los datos de contacto).

### Cosas que dan guerra (avisado quedas)
- Si `npm run dev` empieza a dar **404 en todas las rutas**, borra la carpeta `.next`.
- En **PowerShell**: `$home` es una variable reservada (usa otro nombre) y
  `Set-Content -Encoding utf8` **corrompe los acentos** de los `.tsx`. Para
  reemplazos usa `[System.IO.File]::ReadAllText/WriteAllText` con UTF-8 sin BOM.
- Para comprimir vídeos se usó `ffmpeg` vía `pip install imageio-ffmpeg`.

## 6. Situación con la clienta

- Contactos: **Maricruz** (dueña) y **Génnesis** (lleva contenido y redes).
- El 25 de agosto pidieron una última tanda de cambios y **no se les ha respondido
  desde entonces**. Toca disculparse por la tardanza, aplicar los cambios, cerrar la
  entrega y cobrar.
