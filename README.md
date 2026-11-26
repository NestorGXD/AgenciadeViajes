# 🌍 Contigo Tours (`contigotours`)

> Plataforma web integral y moderna para agencia de viajes, construida con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Stripe Checkout**, **Resend** y **React-Leaflet (OpenStreetMap)**. Lista para despliegue en producción en **Vercel**.

---

## 🚀 Características Principales

### 1. Interfaz Pública y Cotizador Inteligente
- **Landing Page de Alto Impacto:** Hero con buscador rápido, paquetes destacados, razones para viajar, testimonios y preguntas frecuentes.
- **Mapa Interactivo de Destinos:** Integrado con `react-leaflet` y OpenStreetMap (sin coste de API Key). Sincronizado bidireccionalmente con la lista de destinos (Cancún, CDMX, Oaxaca, Bogotá, Medellín, Cartagena, Cusco, Punta Cana) con coordenadas GPS reales.
- **Configurador de Viajes en Tiempo Real (Cotizador):**
  - Selector de fechas con cálculo automático de duración en noches.
  - **Tarifa diferenciada para Adultos y Niños** (descuento del 35% en tarifa base para menores de 12 años).
  - Selector de **Preferencias de Hotel** (`ALL_INCLUSIVE`, `BOUTIQUE`, `BUDGET`, `BEACHFRONT`, `PET_FRIENDLY`) con ajuste dinámico de costos.

### 2. Autenticación y Verificación de Correo (Seguridad)
- Sistema de autenticación con JWT (usando `jose` compatible con Edge Middleware) y hash seguro con `bcryptjs`.
- **Verificación de Correo Obligatoria:** Al registrarse se genera un token criptográfico y se envía un correo con plantilla HTML mediante **Resend**.
- **Regla de Negocio:** El usuario no puede completar ni pagar una reserva hasta verificar su dirección de correo.

### 3. Pasarela de Pagos (Stripe Checkout & Mercado Pago)
- Checkout seguro con Stripe y Webhook automático (`/api/webhook/stripe`).
- Al confirmar el pago exitoso, la reserva pasa a estado `PAID` y se dispara automáticamente el correo de confirmación y emisión de comprobante de viaje.
- Módulo de simulación de pago en local para pruebas instantáneas sin necesidad de webhook expuesto.

### 4. Paneles por Rol (Middleware Protegido)
- **Panel de Cliente (`/client`):**
  - Historial de reservas activas y pasadas.
  - Alerta y botón de reenvío de correo si la cuenta no está verificada.
  - Vista e impresión de **Voucher Oficial de Viaje** con código único y formato para PDF.
- **Panel de Administrador (`/admin`):**
  - Métricas clave: Ingresos totales, reservas pagadas vs pendientes, usuarios registrados y destinos activos.
  - **CRUD de Destinos:** Coordenadas GPS para el mapa, precios base, imágenes y descripciones.
  - **CRUD de Hoteles:** Asociación a destinos, amenidades, precios por noche y categorías.
  - **Gestión de Reservas y Usuarios:** Cambio de estados en tiempo real y asignación de roles (`CLIENT` <-> `ADMIN`).

### 5. Analítica Web
- Integración de **Google Analytics 4 (GA4)** en el layout principal vía script nativo con variable `NEXT_PUBLIC_GA_ID`.

---

## 📂 Estructura del Proyecto

```text
contigotours/
├── .env.example              # Variables de entorno documentadas
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración TypeScript
├── tailwind.config.ts        # Configuración de diseño y paleta de colores
├── next.config.mjs           # Configuración Next.js e imágenes remotas
├── prisma/
│   ├── schema.prisma         # Modelos: User, Destination, Hotel, Booking, Payment
│   └── seed.ts               # Seed con destinos reales, hoteles y usuarios demo
├── src/
│   ├── middleware.ts         # Protección por roles con JWT (Edge compatible)
│   ├── types/
│   │   └── index.ts          # Contratos TypeScript de datos y sesión
│   ├── lib/
│   │   ├── prisma.ts         # Singleton de conexión Prisma Client
│   │   ├── auth.ts           # JWT sign/verify (jose) y hash de contraseñas
│   │   ├── mail.ts           # Servicio Resend con plantillas HTML
│   │   ├── stripe.ts         # Cliente oficial Stripe SDK
│   │   ├── utils.ts          # Formateadores de moneda, fecha y cálculo de noches
│   │   └── destinations.ts   # Helper con datos de respaldo
│   ├── components/
│   │   ├── analytics/
│   │   │   └── GoogleAnalytics.tsx # Componente GA4
│   │   ├── layout/
│   │   │   ├── Navbar.tsx    # Barra de navegación con estado de sesión
│   │   │   └── Footer.tsx    # Pie de página corporativo
│   │   ├── home/             # Componentes de la Landing Page
│   │   ├── map/
│   │   │   ├── MapView.tsx   # Mapa Leaflet (client-only)
│   │   │   └── DestinationsMap.tsx # Wrapper SSR-safe con lista sincronizada
│   │   └── booking/
│   │       ├── TripConfigurator.tsx # Cotizador con cálculo adultos/niños
│   │       └── BookingVoucher.tsx   # Comprobante imprimible de viaje
│   └── app/
│       ├── layout.tsx        # Layout raíz con GA4 y estilos globales
│       ├── page.tsx          # Landing page principal
│       ├── globals.css       # Directivas Tailwind y estilos Leaflet / Print
│       ├── destinations/     # Catálogo y detalle de destinos con hoteles
│       ├── cotizador/        # Página dedicada al cotizador
│       ├── auth/             # Login, Registro y Verificación de Email
│       ├── client/           # Panel privado del cliente y vouchers
│       ├── admin/            # Dashboard administrativo y CRUDs
│       └── api/              # Endpoints REST (auth, checkout, webhook, admin, etc.)
```

---

## 🛠️ Instalación y Ejecución en Local

### Paso 1: Clonar e Instalar Dependencias
```bash
npm install
```

### Paso 2: Configurar Variables de Entorno
Copia el archivo `.env.example` como `.env`:
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales (puedes usar una base de datos gratuita de **Neon**, **Supabase** o **PostgreSQL** local).

### Paso 3: Inicializar Base de Datos y Seed
Ejecuta las migraciones de Prisma y el script de seed para poblar destinos, hoteles y usuarios de prueba:
```bash
# Generar cliente de Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma db push

# Poblar con datos de prueba (Cancún, CDMX, Medellín, etc.)
npm run prisma:seed
```

### Paso 4: Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🔑 Credenciales de Prueba (Seed Data)

| Rol | Correo Electrónico | Contraseña | Acceso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@contigotours.com` | `Admin12345!` | Panel Completo en `/admin` |
| **Cliente** | `cliente@contigotours.com` | `Cliente12345!` | Portal de Viajero en `/client` |

> En la página de Login (`/auth/login`) dispones de botones de un solo clic ("Cargar Admin" / "Cargar Cliente") para ingresar de inmediato.

---

## 💳 Configuración de Pagos (Stripe)

1. En tu [Dashboard de Stripe](https://dashboard.stripe.com/test/apikeys), obtén tu `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Para probar el Webhook en local con el CLI de Stripe:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
   Copia el webhook signing secret (`whsec_...`) en `STRIPE_WEBHOOK_SECRET` dentro de tu `.env`.
3. **Modo Simulación:** Si estás probando la plataforma sin llaves reales de Stripe, en la pantalla de la reserva (`/client/bookings/[id]`) dispones del botón **"Simular Pago Exitoso (Test)"**, el cual ejecutará todo el ciclo de actualización de la base de datos a `PAID` y el envío de correo de confirmación.

---

## 🚀 Despliegue en Producción (Vercel)

Para obtener tu **URL pública** en producción:

1. **Subir el código a GitHub/GitLab:**
   ```bash
   git init
   git add .
   git commit -m "feat: plataforma completa contigo tours"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/contigotours.git
   git push -u origin main
   ```

2. **Crear Base de Datos PostgreSQL gratuita:**
   - Puedes usar [Neon.tech](https://neon.tech), [Supabase](https://supabase.com) o **Vercel Postgres**.
   - Copia la URL de conexión (`DATABASE_URL`).

3. **Importar el repositorio en Vercel:**
   - Ve a [vercel.com](https://vercel.com/new).
   - Conecta tu repositorio `contigotours`.
   - En la sección **Environment Variables**, añade:
     - `DATABASE_URL`: Tu cadena de conexión PostgreSQL.
     - `JWT_SECRET`: Cadena aleatoria de más de 32 caracteres.
     - `NEXT_PUBLIC_APP_URL`: La URL pública de tu proyecto en Vercel (ej. `https://contigotours.vercel.app`).
     - `RESEND_API_KEY`: Tu API Key de [Resend.com](https://resend.com).
     - `EMAIL_FROM`: `Contigo Tours <onboarding@resend.dev>` (o tu dominio verificado).
     - `STRIPE_SECRET_KEY`: Tu llave secreta de Stripe.
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Tu llave pública de Stripe.
     - `STRIPE_WEBHOOK_SECRET`: El secreto del webhook configurado en el Dashboard de Stripe hacia `https://tu-dominio.vercel.app/api/webhook/stripe`.
     - `NEXT_PUBLIC_GA_ID`: Tu identificador de medición de GA4 (ej. `G-XXXXXXXXXX`).

4. **Desplegar:**
   - Haz clic en **Deploy**.
   - Una vez desplegado, en la consola de comandos de tu máquina local o mediante Vercel CLI, ejecuta el seed sobre la base de producción:
     ```bash
     npx prisma db push
     npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
     ```
   - ¡Listo! Tu plataforma estará 100% operativa en su URL pública con certificado SSL y CDN global.
