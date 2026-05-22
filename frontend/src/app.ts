type Priority = "baja" | "media" | "alta";
type Status = "pendiente" | "en proceso" | "finalizada";

interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  status: Status;
}

interface Summary {
  total: number;
  pendientes: number;
  finalizadas: number;
  alta_prioridad: number;
}

const API_BASE = "http://localhost:5000";

const form = document.querySelector<HTMLFormElement>("#task-form");
const titleInput = document.querySelector<HTMLInputElement>("#title");
const descriptionInput = document.querySelector<HTMLTextAreaElement>("#description");
const subjectInput = document.querySelector<HTMLInputElement>("#subject");
const dueDateInput = document.querySelector<HTMLInputElement>("#dueDate");
const prioritySelect = document.querySelector<HTMLSelectElement>("#priority");
const statusSelect = document.querySelector<HTMLSelectElement>("#status");
const submitBtn = document.querySelector<HTMLButtonElement>("#submit-btn");
const cancelBtn = document.querySelector<HTMLButtonElement>("#cancel-btn");
const formStatus = document.querySelector<HTMLSpanElement>("#form-status");

const filterStatus = document.querySelector<HTMLSelectElement>("#filter-status");
const filterPriority = document.querySelector<HTMLSelectElement>("#filter-priority");
const filterSubject = document.querySelector<HTMLInputElement>("#filter-subject");
const filterBtn = document.querySelector<HTMLButtonElement>("#filter-btn");
const clearFiltersBtn = document.querySelector<HTMLButtonElement>("#clear-filters-btn");

const tasksBody = document.querySelector<HTMLTableSectionElement>("#tasks-body");
const emptyState = document.querySelector<HTMLParagraphElement>("#empty-state");

const summaryTotal = document.querySelector<HTMLParagraphElement>("#summary-total");
const summaryPending = document.querySelector<HTMLParagraphElement>("#summary-pending");
const summaryFinished = document.querySelector<HTMLParagraphElement>("#summary-finished");
const summaryHigh = document.querySelector<HTMLParagraphElement>("#summary-high");

let editingId: string | null = null;

function assertElement<T>(element: T | null, message: string): T {
  if (!element) {
    throw new Error(message);
  }
  return element;
}

const ui = {
  form: assertElement(form, "Formulario no encontrado"),
  titleInput: assertElement(titleInput, "Campo titulo no encontrado"),
  descriptionInput: assertElement(descriptionInput, "Campo descripcion no encontrado"),
  subjectInput: assertElement(subjectInput, "Campo asignatura no encontrado"),
  dueDateInput: assertElement(dueDateInput, "Campo fecha no encontrado"),
  prioritySelect: assertElement(prioritySelect, "Campo prioridad no encontrado"),
  statusSelect: assertElement(statusSelect, "Campo estado no encontrado"),
  submitBtn: assertElement(submitBtn, "Boton guardar no encontrado"),
  cancelBtn: assertElement(cancelBtn, "Boton cancelar no encontrado"),
  formStatus: assertElement(formStatus, "Estado del formulario no encontrado"),
  filterStatus: assertElement(filterStatus, "Filtro estado no encontrado"),
  filterPriority: assertElement(filterPriority, "Filtro prioridad no encontrado"),
  filterSubject: assertElement(filterSubject, "Filtro asignatura no encontrado"),
  filterBtn: assertElement(filterBtn, "Boton filtrar no encontrado"),
  clearFiltersBtn: assertElement(clearFiltersBtn, "Boton limpiar no encontrado"),
  tasksBody: assertElement(tasksBody, "Tabla de tareas no encontrada"),
  emptyState: assertElement(emptyState, "Estado vacio no encontrado"),
  summaryTotal: assertElement(summaryTotal, "Resumen total no encontrado"),
  summaryPending: assertElement(summaryPending, "Resumen pendientes no encontrado"),
  summaryFinished: assertElement(summaryFinished, "Resumen finalizadas no encontrado"),
  summaryHigh: assertElement(summaryHigh, "Resumen alta prioridad no encontrado"),
};

function setEditing(task: Task | null) {
  if (task) {
    editingId = task.id;
    ui.titleInput.value = task.title;
    ui.descriptionInput.value = task.description;
    ui.subjectInput.value = task.subject;
    ui.dueDateInput.value = task.dueDate;
    ui.prioritySelect.value = task.priority;
    ui.statusSelect.value = task.status;
    ui.submitBtn.textContent = "Actualizar tarea";
    ui.formStatus.textContent = `Editando: ${task.title}`;
  } else {
    editingId = null;
    ui.form.reset();
    ui.prioritySelect.value = "media";
    ui.statusSelect.value = "pendiente";
    ui.submitBtn.textContent = "Guardar tarea";
    ui.formStatus.textContent = "";
  }
}

function getPayload() {
  return {
    title: ui.titleInput.value.trim(),
    description: ui.descriptionInput.value.trim(),
    subject: ui.subjectInput.value.trim(),
    dueDate: ui.dueDateInput.value,
    priority: ui.prioritySelect.value as Priority,
    status: ui.statusSelect.value as Status,
  };
}

function buildQuery() {
  const params = new URLSearchParams();
  if (ui.filterStatus.value) {
    params.set("status", ui.filterStatus.value);
  }
  if (ui.filterPriority.value) {
    params.set("priority", ui.filterPriority.value);
  }
  if (ui.filterSubject.value.trim()) {
    params.set("subject", ui.filterSubject.value.trim());
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

async function fetchTasks() {
  const response = await fetch(`${API_BASE}/tasks${buildQuery()}`);
  if (!response.ok) {
    throw new Error("No se pudieron obtener las tareas.");
  }
  return (await response.json()) as Task[];
}

async function fetchSummary() {
  const response = await fetch(`${API_BASE}/tasks/summary`);
  if (!response.ok) {
    throw new Error("No se pudo obtener el resumen.");
  }
  return (await response.json()) as Summary;
}

function renderTasks(tasks: Task[]) {
  ui.tasksBody.innerHTML = "";
  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.className = "border-b last:border-none";
    row.innerHTML = `
      <td class="py-2">${task.title}</td>
      <td class="py-2">${task.subject}</td>
      <td class="py-2">${task.dueDate}</td>
      <td class="py-2 capitalize">${task.priority}</td>
      <td class="py-2">${task.status}</td>
      <td class="py-2 space-x-2">
        <button class="edit-btn rounded border border-slate-300 px-2 py-1 text-xs">Editar</button>
        <button class="delete-btn rounded border border-red-300 px-2 py-1 text-xs text-red-600">
          Eliminar
        </button>
      </td>
    `;
    row.querySelector<HTMLButtonElement>(".edit-btn")?.addEventListener("click", () => {
      setEditing(task);
    });
    row.querySelector<HTMLButtonElement>(".delete-btn")?.addEventListener("click", () => {
      void handleDelete(task.id);
    });
    ui.tasksBody.appendChild(row);
  });

  ui.emptyState.style.display = tasks.length ? "none" : "block";
}

function renderSummary(summary: Summary) {
  ui.summaryTotal.textContent = summary.total.toString();
  ui.summaryPending.textContent = summary.pendientes.toString();
  ui.summaryFinished.textContent = summary.finalizadas.toString();
  ui.summaryHigh.textContent = summary.alta_prioridad.toString();
}

async function loadDashboard() {
  const [tasks, summary] = await Promise.all([fetchTasks(), fetchSummary()]);
  renderTasks(tasks);
  renderSummary(summary);
}

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  const payload = getPayload();

  if (!payload.title || !payload.subject || !payload.description || !payload.dueDate) {
    alert("Completa todos los campos requeridos.");
    return;
  }

  const response = await fetch(
    editingId ? `${API_BASE}/tasks/${editingId}` : `${API_BASE}/tasks`,
    {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    alert(error.error || "No se pudo guardar la tarea.");
    return;
  }

  setEditing(null);
  await loadDashboard();
}

async function handleDelete(taskId: string) {
  const confirmed = window.confirm("¿Eliminar esta tarea?");
  if (!confirmed) {
    return;
  }
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    alert(error.error || "No se pudo eliminar la tarea.");
    return;
  }
  if (editingId === taskId) {
    setEditing(null);
  }
  await loadDashboard();
}

ui.form.addEventListener("submit", (event) => {
  void handleSubmit(event);
});

ui.cancelBtn.addEventListener("click", () => {
  setEditing(null);
});

ui.filterBtn.addEventListener("click", () => {
  void loadDashboard();
});

ui.clearFiltersBtn.addEventListener("click", () => {
  ui.filterStatus.value = "";
  ui.filterPriority.value = "";
  ui.filterSubject.value = "";
  void loadDashboard();
});

setEditing(null);
void loadDashboard();
