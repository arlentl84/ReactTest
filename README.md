# React + TypeScript + Vite

# Gestor de Usuarios y Publicaciones

Aplicación web desarrollada con React, TypeScript y Vite que consume la API pública de JSONPlaceholder https://jsonplaceholder.typicode.com/. Permite buscar usuarios, visualizar sus publicaciones y crear nuevas entradas mediante un formulario validado.

## Cómo ejecutar el proyecto

### Requisitos previos
- Node.js (v18 o superior)
- npm

### Instalación y ejecución
1. Clonar el repositorio publico: 
   https://github.com/arlentl84/ReactTest.git
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Ejecutar la suite de pruebas:
   ```bash
   npm test
   ```

## Decisiones técnicas

- **Vite + TypeScript:** Elegido por su rapidez de compilación y tipado estricto para modelar las entidades `User` y `Post`, evitando errores en tiempo de ejecución.
- **Separación de responsabilidades:** Se aisló la capa de comunicación HTTP en `src/services/api` para facilitar el mockeo en los tests unitarios y mantener los componentes enfocados únicamente en la interfaz y el estado de UI.
- **Manejo de IDs y estado local al crear publicaciones:** Dado que JSONPlaceholder es una API de prueba que no persiste datos y siempre responde con `id: 101` en peticiones `POST`, los posts nuevos se almacenan en un estado separado (`createdPosts`) y se les asigna un identificador único en el cliente mediante `crypto.randomUUID()` (tipado como `number` mediante aserción para mantener compatibilidad con la interfaz `Post` de la API). Esto garantiza que no existan colisiones de `key` en React al crear múltiples publicaciones seguidas.
- **Accesibilidad en estados:** Se utilizaron roles semánticos (`role="status"` y `role="alert"`) para anunciar estados de carga y errores tanto a lectores de pantalla como en las consultas de Testing Library.

## Qué haría con más tiempo

- **Gestión de caché y peticiones:** Incorporar TanStack Query (React Query) para cachear las publicaciones por usuario y evitar peticiones repetidas al alternar entre usuarios ya visitados.
- **Paginación o scroll virtual:** Preparar la lista de usuarios y publicaciones para manejar grandes volúmenes de datos.
- **Persistencia local:** Sincronizar los nuevos posts creados con `localStorage` para que no se pierdan al recargar la página.
- **Tests E2E:** Añadir Playwright para probar el flujo completo en un navegador real contra la API.

## Uso de Inteligencia Artificial

- **Qué le pedí:** Diseño inicial del proyecto: CSS y generación de casos base para las pruebas con Testing Library.
- **Qué acepté:** La configuración de `vite.config.ts` y los selectores accesibles (`getByRole`, `getByLabelText`) en los tests.
- **Qué corregí:**   
  1. Ajusté los estados de error para separar los fallos al cargar usuarios de los fallos al cargar o crear publicaciones, evitando que un error secundario ocultara la barra lateral de usuarios.
