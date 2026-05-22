# TaskCampus

Aplicacion web para registrar, consultar, actualizar y eliminar tareas academicas. El frontend
usa TypeScript con HTML/Tailwind, y el backend esta construido en Python con persistencia en un
archivo JSON.

## Estructura del repositorio
```
taskcampus/
├── specs/
│   └── taskcampus-spec.md
├── frontend/
│   ├── index.html
│   ├── src/
│   └── tsconfig.json
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── data/
└── .gitignore
```

## Plan tecnico de desarrollo
1. Definir especificacion funcional en `specs/taskcampus-spec.md`.
2. Preparar estructura de carpetas, dependencias y configuracion base.
3. Implementar API REST en Python con persistencia JSON.
4. Implementar interfaz en TypeScript con consumo de API.
5. Probar CRUD, filtros y resumen.
6. Documentar instalacion y uso en este README.

## Tareas del proyecto
1. Crear repositorio y estructura inicial.
2. Implementar modulo de tareas (CRUD + filtros + resumen) en backend.
3. Implementar interfaz con formulario, filtros y listado en frontend.
4. Verificar consumo de API desde el navegador.
5. Registrar commits, ramas y pull request en GitHub.

## Instalacion del backend
1. Abrir una terminal y entrar a la carpeta `backend`.
2. Crear un entorno virtual (opcional) y activarlo.
3. Instalar dependencias:
   ```
   pip install -r requirements.txt
   ```
4. Ejecutar el servidor:
   ```
   python app.py
   ```
El backend queda disponible en `http://localhost:5000`.

## Instalacion del frontend
1. Abrir una terminal en la carpeta `frontend`.
2. Instalar dependencias:
   ```
   npm install
   ```
3. Compilar TypeScript:
   ```
   npm run build
   ```
4. Abrir `frontend/index.html` en el navegador (o usar una extension de servidor local).

## Endpoints disponibles
| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | /tasks | Listar tareas (filtros: status, priority, subject) |
| GET | /tasks/{id} | Consultar tarea |
| POST | /tasks | Crear tarea |
| PUT | /tasks/{id} | Actualizar tarea |
| DELETE | /tasks/{id} | Eliminar tarea |
| GET | /tasks/summary | Mostrar resumen estadistico |

## Integrantes del grupo
- Brandon (brandon0405)
