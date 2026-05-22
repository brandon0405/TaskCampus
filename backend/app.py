from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Tuple

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_FILE = Path(__file__).parent / "data" / "tasks.json"
ALLOWED_PRIORITIES = {"baja", "media", "alta"}
ALLOWED_STATUS = {"pendiente", "en proceso", "finalizada"}


def load_tasks() -> List[Dict[str, Any]]:
    if not DATA_FILE.exists():
        return []
    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except (json.JSONDecodeError, OSError):
        return []
    if not isinstance(data, list):
        return []
    return data


def save_tasks(tasks: List[Dict[str, Any]]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(tasks, file, ensure_ascii=True, indent=2)


def is_valid_date(value: str) -> bool:
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        return False
    return True


def validate_task_payload(
    payload: Dict[str, Any], partial: bool = False
) -> Tuple[bool, str]:
    required_fields = ["title", "description", "subject", "dueDate", "priority", "status"]

    if not partial:
        missing = [field for field in required_fields if field not in payload]
        if missing:
            return False, f"Faltan campos requeridos: {', '.join(missing)}."

    if "title" in payload and not str(payload["title"]).strip():
        return False, "El titulo es obligatorio."
    if "description" in payload and not str(payload["description"]).strip():
        return False, "La descripcion es obligatoria."
    if "subject" in payload and not str(payload["subject"]).strip():
        return False, "La asignatura es obligatoria."
    if "dueDate" in payload:
        due_date = str(payload["dueDate"]).strip()
        if not due_date:
            return False, "La fecha de entrega es obligatoria."
        if not is_valid_date(due_date):
            return False, "La fecha de entrega debe tener el formato YYYY-MM-DD."
    if "priority" in payload:
        if payload["priority"] not in ALLOWED_PRIORITIES:
            return False, "La prioridad debe ser baja, media o alta."
    if "status" in payload:
        if payload["status"] not in ALLOWED_STATUS:
            return False, "El estado debe ser pendiente, en proceso o finalizada."

    return True, ""


@app.get("/tasks")
def list_tasks():
    tasks = load_tasks()
    status = request.args.get("status")
    priority = request.args.get("priority")
    subject = request.args.get("subject")

    if status:
        tasks = [task for task in tasks if task.get("status") == status]
    if priority:
        tasks = [task for task in tasks if task.get("priority") == priority]
    if subject:
        normalized_subject = subject.strip().lower()
        tasks = [
            task
            for task in tasks
            if normalized_subject in str(task.get("subject", "")).lower()
        ]

    return jsonify(tasks)


@app.get("/tasks/summary")
def task_summary():
    tasks = load_tasks()
    total = len(tasks)
    pendientes = len([task for task in tasks if task.get("status") == "pendiente"])
    finalizadas = len([task for task in tasks if task.get("status") == "finalizada"])
    alta_prioridad = len([task for task in tasks if task.get("priority") == "alta"])

    return jsonify(
        {
            "total": total,
            "pendientes": pendientes,
            "finalizadas": finalizadas,
            "alta_prioridad": alta_prioridad,
        }
    )


@app.get("/tasks/<task_id>")
def get_task(task_id: str):
    tasks = load_tasks()
    task = next((item for item in tasks if item.get("id") == task_id), None)
    if not task:
        return jsonify({"error": "Tarea no encontrada."}), 404
    return jsonify(task)


@app.post("/tasks")
def create_task():
    payload = request.get_json(silent=True) or {}
    is_valid, message = validate_task_payload(payload)
    if not is_valid:
        return jsonify({"error": message}), 400

    tasks = load_tasks()
    new_task = {
        "id": uuid.uuid4().hex,
        "title": payload["title"].strip(),
        "description": payload["description"].strip(),
        "subject": payload["subject"].strip(),
        "dueDate": payload["dueDate"].strip(),
        "priority": payload["priority"],
        "status": payload["status"],
    }
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201


@app.put("/tasks/<task_id>")
def update_task(task_id: str):
    payload = request.get_json(silent=True) or {}
    is_valid, message = validate_task_payload(payload, partial=True)
    if not is_valid:
        return jsonify({"error": message}), 400

    tasks = load_tasks()
    task = next((item for item in tasks if item.get("id") == task_id), None)
    if not task:
        return jsonify({"error": "Tarea no encontrada."}), 404

    for field in ["title", "description", "subject", "dueDate", "priority", "status"]:
        if field in payload:
            value = payload[field].strip() if isinstance(payload[field], str) else payload[field]
            task[field] = value

    save_tasks(tasks)
    return jsonify(task)


@app.delete("/tasks/<task_id>")
def delete_task(task_id: str):
    tasks = load_tasks()
    new_tasks = [task for task in tasks if task.get("id") != task_id]
    if len(new_tasks) == len(tasks):
        return jsonify({"error": "Tarea no encontrada."}), 404

    save_tasks(new_tasks)
    return jsonify({"deleted": True})


if __name__ == "__main__":
    app.run(debug=True)
