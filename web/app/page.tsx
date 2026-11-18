"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type TaskStatus = "Pending" | "Completed";
type Task = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"All" | TaskStatus>("All");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not load tasks.");
      setTasks(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect to the API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const visibleTasks = useMemo(
    () => filter === "All" ? tasks : tasks.filter((task) => task.status === filter),
    [tasks, filter]
  );

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingId(null);
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.due_date);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        title,
        description,
        dueDate,
        status: editingId
          ? tasks.find((task) => task.id === editingId)?.status || "Pending"
          : "Pending"
      };
      const response = await fetch(
        editingId ? `${API_URL}/api/tasks/${editingId}` : `${API_URL}/api/tasks`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const result = await response.json();
      if (!response.ok) {
        const messages = result.errors?.map((item: { message: string }) => item.message).join(", ");
        throw new Error(messages || result.message || "Could not save the task.");
      }

      setNotice(editingId ? "Task updated successfully." : "Task created successfully.");
      resetForm();
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function completeTask(id: number) {
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}/complete`, { method: "PATCH" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not complete task.");
      setNotice("Task marked as completed.");
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  async function deleteTask(id: number) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not delete task.");
      setNotice("Task deleted successfully.");
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">FBC23 Developer Diagnostic</p>
          <h1>Mini Task Tracker</h1>
          <p className="header-copy">Create tasks, keep track of due dates and see what is complete.</p>
        </div>
        <div className="summary-pill">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</div>
      </header>

      <section className="panel form-panel" aria-labelledby="form-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Task details</p>
            <h2 id="form-heading">{editingId ? "Edit task" : "Add a task"}</h2>
          </div>
          {editingId && <button className="button button-light" type="button" onClick={resetForm}>Cancel edit</button>}
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required placeholder="e.g. Prepare project walkthrough" />

          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} placeholder="Add more details (optional)" />

          <label htmlFor="dueDate">Due date</label>
          <input id="dueDate" name="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />

          <button className="button button-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save changes" : "Add task"}
          </button>
        </form>
      </section>

      <section className="task-section" aria-labelledby="tasks-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your work</p>
            <h2 id="tasks-heading">Tasks</h2>
          </div>
          <div className="filters" aria-label="Filter tasks">
            {(["All", "Pending", "Completed"] as const).map((value) => (
              <button key={value} type="button" className={`filter-button ${filter === value ? "active" : ""}`} onClick={() => setFilter(value)} aria-pressed={filter === value}>
                {value}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="message error" role="alert">{error}</p>}
        {notice && <p className="message success" role="status">{notice}</p>}
        {loading ? <p className="empty-state">Loading tasks...</p> : visibleTasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>{filter === "All" ? "Add your first task using the form above." : `There are no ${filter.toLowerCase()} tasks.`}</p>
          </div>
        ) : (
          <div className="task-list">
            {visibleTasks.map((task) => (
              <article className={`task-card ${task.status === "Completed" ? "is-completed" : ""}`} key={task.id}>
                <div className="task-main">
                  <div className="task-title-row">
                    <h3>{task.title}</h3>
                    <span className={`status status-${task.status.toLowerCase()}`}>{task.status}</span>
                  </div>
                  {task.description && <p className="task-description">{task.description}</p>}
                  <p className="due-date">Due: {new Date(`${task.due_date}T00:00:00`).toLocaleDateString()}</p>
                </div>
                <div className="task-actions">
                  {task.status === "Pending" && <button className="button button-small button-success" onClick={() => void completeTask(task.id)}>Complete</button>}
                  <button className="button button-small button-light" onClick={() => startEditing(task)}>Edit</button>
                  <button className="button button-small button-danger" onClick={() => void deleteTask(task.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer>FBC23 Mini Task Tracker</footer>
    </main>
  );
}
