# SPA-Correction
# Corrector de Español

App web para corrección automática de textos en español usando Claude (Anthropic).

## Archivos del proyecto

```
corrector-espanol/
├── index.html        ← Interfaz de usuario
├── api/
│   └── corregir.js   ← Edge Function (protege la API key)
├── vercel.json       ← Configuración de Vercel
└── README.md
```

---

## Instrucciones de deploy (paso a paso)

### Paso 1 — Crear las cuentas (si no las tienes)

- **GitHub**: https://github.com/signup (gratis)
- **Vercel**: https://vercel.com/signup — elige "Continue with GitHub" (gratis)

---

### Paso 2 — Subir el proyecto a GitHub

1. Inicia sesión en GitHub
2. Haz clic en **"New repository"** (botón verde)
3. Nombre del repositorio: `corrector-espanol`
4. Déjalo en **Public** y haz clic en **"Create repository"**
5. En la página del repositorio vacío, haz clic en **"uploading an existing file"**
6. Sube los tres archivos en su estructura de carpetas:
   - `index.html`
   - `api/corregir.js`
   - `vercel.json`
7. Haz clic en **"Commit changes"**

---

### Paso 3 — Conectar GitHub con Vercel

1. Inicia sesión en https://vercel.com
2. Haz clic en **"Add New Project"**
3. Selecciona el repositorio `corrector-espanol`
4. En la pantalla de configuración **no cambies nada**, solo haz clic en **"Deploy"**

---

### Paso 4 — Agregar la API key de Anthropic

1. Una vez desplegado, ve a tu proyecto en Vercel
2. Haz clic en **Settings** → **Environment Variables**
3. Agrega una nueva variable:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: tu API key (empieza con `sk-ant-...`)
   - **Environments**: selecciona los tres (Production, Preview, Development)
4. Haz clic en **Save**
5. Ve a **Deployments** y haz clic en **"Redeploy"** para que tome efecto

---

### Paso 5 — Listo

Vercel te dará una URL pública del tipo:
```
https://corrector-espanol-tuusuario.vercel.app
```

Esa URL es tu app funcionando. Puedes compartirla con quien quieras.

---

## Actualizaciones futuras

Cada vez que subas cambios al repositorio de GitHub, Vercel redesplegará la app automáticamente en segundos.

---

## Obtener una API key de Anthropic

1. Ve a https://console.anthropic.com
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** → **Create Key**
4. Copia la key (solo se muestra una vez)

La API tiene un costo por uso. Para un volumen bajo (uso académico), el costo es muy pequeño (menos de $0.01 por texto).
