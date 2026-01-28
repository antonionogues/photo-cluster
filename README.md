# PhotoCluster

PhotoCluster es una aplicación para **organizar fotos de eventos por personas** usando reconocimiento facial, con el objetivo de acelerar el flujo de trabajo de fotógrafos (bodas, comuniones, eventos corporativos, etc.).

## Qué hace

- **Auto (Agrupar todo):** analiza las fotos del evento y genera **carpetas por persona** detectada.
- **Búsqueda (Encontrar personas concretas):** subes fotos de referencia y el sistema devuelve solo las fotos donde aparece esa persona.
- **Revisión rápida:** vista por “clusters”, galería, mover fotos entre carpetas y “No clasificadas”.

## Demo pública (UI)

La demo pública está desplegada en GitHub Pages:

`https://antonionogues.github.io/photo-cluster/`

Para entrar, escribe `DEMO` en la pantalla inicial.

## Qué incluye este repositorio

Este repositorio **solo publica el frontend** (interfaz) a modo escaparate.

- Incluye: UI (React/Vite) + workflow de GitHub Pages.
- No incluye: backend, servidor de licencias, ni el pipeline/modelo de clustering.

> Motivo: mantener privado el “core” (modelo/pipeline) y evitar que se pueda replicar el sistema completo clonando este repo.

## Publicar (GitHub Pages)

El despliegue se hace con GitHub Actions (ya configurado en `.github/workflows/pages.yml`).

1. En GitHub: **Settings → Pages → Build and deployment → GitHub Actions**
2. Ve a **Actions** y espera a que termine **Deploy to GitHub Pages**

## Desarrollo local (solo UI)

```bash
cd frontend
npm install
npm run dev
```


