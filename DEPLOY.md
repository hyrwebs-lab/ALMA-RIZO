# Publicar Alma Rizo en Vercel (versión definitiva)

La web usa una base de datos real (libSQL, compatible con SQLite). En **local**
funciona sola con un archivo; en **Vercel** hay que usar **Turso** (base de datos
alojada, gratis) porque Vercel no guarda archivos entre peticiones.

---

## 1. Crear la base de datos en Turso (5 min, gratis)

1. Crea una cuenta en <https://turso.tech> e instala su CLI, o hazlo desde su web.
2. Crea la base de datos:
   ```bash
   turso db create alma-rizo
   turso db show alma-rizo --url          # → copia la URL (libsql://...)
   turso db tokens create alma-rizo       # → copia el token
   ```
   Guarda esos dos valores: **URL** y **token**.

> Las tablas y el contenido inicial se crean **solos** la primera vez que se
> abre la web (no hay que importar nada).

---

## 2. Subir el proyecto a Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En <https://vercel.com> → **Add New → Project** → importa el repo.
3. En **Environment Variables** añade:

   | Nombre | Valor |
   |---|---|
   | `DATABASE_URL` | la URL de Turso (`libsql://...`) |
   | `DATABASE_AUTH_TOKEN` | el token de Turso |
   | `OWNER_PASSWORD` | **contraseña fuerte** para Maricruz |
   | `ADMIN_PASSWORD` | **contraseña fuerte** para administración |
   | `WORKER_PASSWORD` | contraseña para el equipo |

   > ⚠️ **Importante:** pon contraseñas de verdad. Si no las pones, se usan las
   > por defecto (`alma` / `admin` / `equipo`), que son inseguras.

4. **Deploy**. Vercel construye y publica la web.

---

## 3. Primer arranque

- Al abrir la web por primera vez, la base de datos se crea y se rellena con el
  contenido inicial (servicios, productos, reseñas…). **Las reservas empiezan
  vacías** — solo aparecerán las citas reales.
- Entra en `tudominio.vercel.app/admin` con `maricruz@almarizo.com` y la
  contraseña que pusiste en `OWNER_PASSWORD`.

---

## 4. Dominio propio

En Vercel → proyecto → **Settings → Domains** → añade el dominio de la peluquería
y sigue las instrucciones de DNS. La web queda publicada en ese dominio.

---

## Desarrollo en local

```bash
npm install
npm run dev        # usa una base de datos local en ./data/almarizo.db (no toca Turso)
```

Para probar en local contra Turso, copia `.env.example` a `.env.local` y rellena
`DATABASE_URL` y `DATABASE_AUTH_TOKEN`.

---

## Qué funciona ya (verificado)

- Reservas online con **bloqueo de doble reserva** (misma estilista, misma hora).
- Panel `/admin` con login real (cookie de sesión) y 3 roles.
- Todo lo que edita la dueña en el panel (servicios, precios, productos, reseñas,
  antes/después, galería, novedades) **se refleja en la web pública**.
- Datos compartidos entre todos los dispositivos (es una base de datos real).
