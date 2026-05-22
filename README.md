# TaskCampus

TaskCampus es una aplicacion web para registrar, consultar, actualizar, eliminar y filtrar tareas academicas. El frontend usa HTML, Tailwind y TypeScript; el backend usa Python con Flask y persistencia en un archivo JSON.

El proyecto se organizo siguiendo Spec Driven Development con Spec Kit: primero se documento la especificacion en `specs/taskcampus-spec.md`, luego se implemento el backend, despues el frontend y finalmente se dejo evidencia de ramas, commits y pull request en GitHub.

## Estructura del repositorio

```text
taskcampus/
|-- specs/
|   `-- taskcampus-spec.md
|-- frontend/
|   |-- index.html
|   |-- package.json
|   |-- tsconfig.json
|   `-- src/
|       `-- app.ts
|-- backend/
|   |-- app.py
|   |-- requirements.txt
|   `-- data/
|       `-- tasks.json
|-- README.md
`-- .gitignore
```

## Instalacion del backend

1. Entrar a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Crear y activar un entorno virtual:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Instalar dependencias:

   ```bash
   pip install -r requirements.txt
   ```

4. Ejecutar el servidor:

   ```bash
   python app.py
   ```

El backend queda disponible en `http://localhost:5000`.

## Instalacion del frontend

1. Entrar a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Compilar TypeScript:

   ```bash
   npm run build
   ```

4. Servir la carpeta del frontend:

   ```bash
   python -m http.server 5173
   ```

5. Abrir `http://localhost:5173` en el navegador.

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/tasks` | Lista tareas. Acepta filtros `status`, `priority` y `subject`. |
| GET | `/tasks/{id}` | Consulta una tarea por identificador. |
| POST | `/tasks` | Crea una tarea. |
| PUT | `/tasks/{id}` | Actualiza una tarea. |
| DELETE | `/tasks/{id}` | Elimina una tarea. |
| GET | `/tasks/summary` | Devuelve total, pendientes, finalizadas y alta prioridad. |

## Formato de tarea

```json
{
  "title": "Informe de laboratorio",
  "description": "Preparar resultados y conclusiones",
  "subject": "Fisica",
  "dueDate": "2026-06-10",
  "priority": "alta",
  "status": "pendiente"
}
```

Valores permitidos:

- `priority`: `baja`, `media`, `alta`
- `status`: `pendiente`, `en proceso`, `finalizada`

## Evidencia GitHub

- Repositorio: `https://github.com/brandon0405/TaskCampus`
- Rama base: `main`
- Rama de implementacion: `feature/taskcampus-implementation`
- Pull request: se genera desde la rama de implementacion hacia `main`.

## Integrantes

- Brandon (`brandon0405`)
