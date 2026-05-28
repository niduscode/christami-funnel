# Mueblería Christami · Funnel de Leads

Landing + funnel de captación + panel admin para [Mueblería Christami](https://www.instagram.com/muebleriachristami/) (Los Lagos, Chile). Implementa la [spec técnica](./spec-funnel-leads.html) v1.1.

## Stack

- **Next.js 16** · App Router · Server Actions
- **Tailwind CSS v4** · tokens en `@theme` (paleta Christami)
- **Supabase** · Postgres + Auth (OTP por email) + RLS
- **Resend** · email transaccional a `mueblechristami@gmail.com`
- **Meta Pixel + GA4** · tracking client-side
- **WhatsApp** · redirect vía `wa.me` con mensaje pre-llenado
- **Vercel** · deploy

## Estructura

```
.
├── app/
│   ├── page.tsx                # Landing principal
│   ├── layout.tsx              # Layout global · Pixel · GA4
│   ├── globals.css             # Paleta + Tailwind v4
│   ├── gracias/                # Página intermedia + redirect WhatsApp
│   ├── privacidad/             # Política de privacidad (Ley 19.628)
│   ├── login/                  # OTP email
│   ├── admin/                  # Panel protegido
│   │   ├── layout.tsx          # Verifica sesión Supabase
│   │   ├── page.tsx            # Lista de leads + filtros
│   │   └── leads/[id]/         # Detalle + cambio de estado + interacciones
│   ├── actions/
│   │   └── submit-lead.ts      # Server action (Zod + INSERT + Resend)
│   ├── components/             # Hero, VSL, Portfolio, LeadForm, Footer, Pixel
│   └── lib/
│       ├── schemas.ts          # Zod + tipos Lead
│       ├── score.ts            # Cálculo 0–100
│       ├── whatsapp.ts         # builder wa.me
│       ├── email.tsx           # Template HTML del mail
│       └── supabase/           # clients server + browser
├── public/
│   ├── logo.jpg
│   └── portafolio/             # 8 proyectos copiados de assets/
├── supabase/
│   ├── schema.sql              # Tablas leads + interacciones
│   └── rls.sql                 # Políticas RLS
├── .env.example
└── package.json
```

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables
cp .env.example .env.local
# Editar .env.local con keys reales de Supabase, Resend, Meta Pixel, GA4

# 3. Crear esquema en Supabase
# En el SQL editor del proyecto Supabase, correr en orden:
#   supabase/schema.sql
#   supabase/rls.sql

# 4. Levantar dev
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Datos de contacto del cliente (ya en código)

| Recurso | Valor |
| --- | --- |
| WhatsApp | `+56 9 5304 1094` |
| Email | `mueblechristami@gmail.com` |
| Instagram | [@muebleriachristami](https://www.instagram.com/muebleriachristami/) |
| Facebook | [Página](https://www.facebook.com/share/1JP1RXSiuS/?mibextid=wwXIfr) |
| TikTok | [@christamidelgado](https://www.tiktok.com/@christamidelgado) |
| Dirección | Via Romana 1812, Parque Cardonal, Los Lagos |

## Pendientes antes de producción

- [ ] Subir VSL real a `public/vsl-placeholder.mp4` (o cambiar `src` en `app/components/VSL.tsx`)
- [ ] Obtener IDs reales de Meta Pixel y GA4 y ponerlos en `.env.local`
- [ ] Verificar dominio `christami.cl` (o el que se decida) y configurar en Vercel
- [ ] Agregar emails autorizados a Supabase Auth (panel → Authentication → Users)
- [ ] Verificar dominio de envío en Resend (`leads@christami.cl`)
- [ ] Cargar política de privacidad revisada por abogado

## Cómo agregar fotos al portafolio

1. Copiar imagen a `public/portafolio/`.
2. Agregar entrada al array `ITEMS` en `app/components/Portfolio.tsx`.

## Comandos

```bash
npm run dev        # desarrollo
npm run build      # build producción
npm run start      # servidor producción
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```
