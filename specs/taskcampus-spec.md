# Especificacion del sistema TaskCampus

## Metodologia SDD y Spec Kit
La practica se desarrollo con enfoque Spec Driven Development: primero se define la especificacion, luego el plan tecnico y finalmente las tareas de implementacion. Este documento funciona como artefacto principal de Spec Kit para alinear problema, alcance, requisitos y validacion antes de construir el codigo.

## Problema
Los estudiantes universitarios suelen manejar tareas de varias asignaturas con diferentes fechas de entrega, prioridades y estados. Cuando esa informacion queda distribuida en apuntes, chats o recordatorios aislados, es facil perder visibilidad de los pendientes y de las actividades de mayor urgencia.

## Objetivo
Desarrollar TaskCampus, una aplicacion web para registrar, consultar, actualizar, eliminar y filtrar tareas academicas, con un resumen general que ayude al estudiante a priorizar su trabajo diario.

## Usuarios
El sistema esta dirigido a estudiantes universitarios que necesitan organizar tareas por asignatura, fecha, prioridad y estado de avance.

## Historias de usuario
- Como estudiante, quiero registrar tareas academicas con asignatura, fecha y prioridad para organizar mis entregas.
- Como estudiante, quiero filtrar mis tareas por estado, prioridad o asignatura para encontrar rapidamente lo que debo atender.
- Como estudiante, quiero editar, finalizar o eliminar tareas para mantener actualizado mi avance academico.

## Requisitos funcionales
- RF01. El sistema debe permitir registrar tareas con titulo, descripcion, asignatura, fecha de entrega, prioridad y estado.
- RF02. El sistema debe permitir listar todas las tareas registradas.
- RF03. El sistema debe permitir consultar una tarea especifica por su identificador.
- RF04. El sistema debe permitir actualizar la informacion de una tarea existente.
- RF05. El sistema debe permitir eliminar una tarea existente.
- RF06. El sistema debe permitir filtrar tareas por estado, prioridad y asignatura, y mostrar un resumen con total, pendientes, finalizadas y tareas de alta prioridad.

## Requisitos no funcionales
- RNF01. La interfaz debe ser clara, responsiva y facil de usar desde un navegador moderno.
- RNF02. El backend debe exponer una API REST con respuestas JSON.
- RNF03. La informacion debe persistirse en un archivo JSON local para conservar las tareas entre ejecuciones.
- RNF04. El proyecto debe estar documentado, versionado en GitHub y organizado con ramas, commits y pull request.

## Arquitectura requerida
- Frontend: HTML, Tailwind y TypeScript.
- Backend: Python con Flask y persistencia en archivo JSON.
- Persistencia: `backend/data/tasks.json`.

## Contrato de datos
Cada tarea debe manejar los siguientes campos:

- `title`: titulo de la tarea.
- `description`: descripcion de la actividad.
- `subject`: asignatura asociada.
- `dueDate`: fecha de entrega en formato `YYYY-MM-DD`.
- `priority`: prioridad permitida: `baja`, `media` o `alta`.
- `status`: estado permitido: `pendiente`, `en proceso` o `finalizada`.

## Endpoints requeridos
- `GET /tasks`: lista tareas y acepta filtros `status`, `priority` y `subject`.
- `GET /tasks/{id}`: consulta una tarea por identificador.
- `POST /tasks`: crea una tarea.
- `PUT /tasks/{id}`: actualiza una tarea.
- `DELETE /tasks/{id}`: elimina una tarea.
- `GET /tasks/summary`: devuelve total, pendientes, finalizadas y alta prioridad.

## Criterios de aceptacion
- La API debe validar campos obligatorios, prioridad, estado y formato de fecha.
- El frontend debe consumir la API para crear, listar, editar, eliminar y filtrar tareas.
- El resumen debe actualizarse despues de crear, editar o eliminar tareas.
- El repositorio debe incluir `specs/taskcampus-spec.md`, `frontend`, `backend`, `README.md` y `.gitignore`.
