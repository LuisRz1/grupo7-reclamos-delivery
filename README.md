# Grupo 7 — Ejecución de un Sprint Scrum

Tablero Kanban de la HU **Reclamo asociado a un pedido** para una app de delivery. Permite organizar las seis tareas en **To Do, Doing y Done**, moverlas por arrastre o mediante un selector accesible, filtrar por área y exportar evidencia Markdown para Padlet.

## Equipo

| Integrante | Rol |
| --- | --- |
| Luis Angulo Ruiz | Product Owner |
| Lucely Rubi Mendoza Deza | Scrum Master |
| Leonardo Chavez | Developer — Frontend |
| Josue Santiago Laurente Ticona | Developer — Backend |
| Kevin Quispe Huaraca | Developer — QA |

## Estado inicial

| Tarea | Descripción | Estado |
| --- | --- | --- |
| 01 | Maquetar interfaz de selección de motivo de reclamo | Done |
| 02 | Construir componente de carga y vista previa de fotos | Done |
| 03 | Validar límite de peso (5 MB) y formato de archivos — Backend | To Do |
| 04 | Crear API en backend para recibir reclamos y guardar imágenes | Doing |
| 05 | Diseñar modal de confirmación con el ID del ticket | Doing |
| 06 | Pruebas funcionales de extremo a extremo (E2E) — QA | Doing |

Los estados provienen del último tablero compartido por el equipo. Frontend reportó 80 % y Backend 75 %: estos porcentajes no equivalen al porcentaje de tareas terminadas. El tablero calcula este último por separado (inicialmente, 2/6 = 33 %).

## Ejecutar

Requiere Node.js 24.

```sh
npm ci
vercel link
vercel env pull .env.local
npm run dev
```

Abrir http://127.0.0.1:5173. Para compilar: `npm run build`. Para validar el contrato del servidor: `npm test`.

## Persistencia del tablero

`GET /api/board` inicia una sesión anónima mediante una cookie HttpOnly firmada y recupera su tablero. `POST /api/board` valida las seis tareas y guarda los estados en un Blob privado de Vercel. Cada navegador mantiene su propia sesión; no es un tablero compartido con autenticación de equipo. Se conserva una copia local si la sincronización no está disponible. Las credenciales solo se usan en el servidor y no se incluyen en Git.

La variable de entorno `BLOB_READ_WRITE_TOKEN` se configura al conectar el almacén privado al proyecto de Vercel. Nunca debe usar un prefijo `VITE_`, porque esos valores se publican en el navegador.

## Prototipo complementario

`/demo.html` incluye un prototipo de reclamos para mostrar la HU: elegibilidad de 48 horas, motivo y descripción obligatorios, 1–3 fotos JPG/JPEG/PNG de hasta 5 MiB cada una, vista previa y modal con ticket. Es un prototipo local: los reclamos se guardan en localStorage y las fotos completas no se envían a una API real. La tarea 04 del tablero representa el trabajo reportado por el equipo, no un endpoint de reclamos implementado en este repositorio. La cámara depende del dispositivo y no se ha verificado con hardware físico.

## Despliegue

Vite compila el frontend a `dist/` y Vercel ejecuta `api/board.js` como función Node.js. La configuración está en `vercel.json`. El proyecto puede vincularse al repositorio para desplegar automáticamente los cambios de su rama predeterminada.

## Fuentes técnicas

- [Vercel Blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk)
- [Vercel Deployments](https://vercel.com/docs/deployments)
