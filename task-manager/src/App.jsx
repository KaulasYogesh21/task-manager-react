import { useEffect, useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    const fixed = saved.map((t) => ({
      ...t,
      completed: t.completed ?? false,
      priority: t.priority ?? "Medium",
      completedAt: t.completedAt ?? null,
    }));
    setTasks(fixed);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        completed: false,
        priority,
        completedAt: null,
      },
    ]);
    setTask("");
    setPriority("Medium");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
    if (e.key === "Escape") setTask("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed
                ? new Date().toLocaleString()
                : null,
            }
          : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEdit = (t) => {
    setEditId(t.id);
    setEditText(t.text);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editText } : t
      )
    );
    setEditId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const markAllCompleted = () => {
    setTasks(
      tasks.map((t) => ({
        ...t,
        completed: true,
        completedAt: new Date().toLocaleString(),
      }))
    );
  };

  const markAllPending = () => {
    setTasks(
      tasks.map((t) => ({
        ...t,
        completed: false,
        completedAt: null,
      }))
    );
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter((t) =>
      t.text.toLowerCase().includes(search.toLowerCase())
    );

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="input-box">
        <input
          value={task}
          placeholder="Enter task..."
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button onClick={addTask} disabled={!task.trim()}>
          Add
        </button>
      </div>

      <input
        className="search"
        placeholder="Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="counter">
        <span>Total: {total}</span>
        <span>Completed: {completed}</span>
        <span>Pending: {pending}</span>
      </div>

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      <div className="bulk">
        <button onClick={markAllCompleted} disabled={total === 0}>
          Mark All Completed
        </button>
        <button onClick={markAllPending} disabled={total === 0}>
          Mark All Pending
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty">No tasks yet. Add your first task 🚀</p>
      ) : (
        <ul>
          {filteredTasks.map((t) => (
            <li key={t.id} className={t.completed ? "done" : ""}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(t.id)}
              />

              <div className="task-info">
                {editId === t.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div>
                      <button onClick={() => saveEdit(t.id)}>💾</button>
                      <button onClick={cancelEdit}>❌</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="task-header">
                      <strong>{t.text}</strong>
                      <span className={`priority ${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>
                    </div>
                    {t.completedAt && (
                      <small className="completed-time">
                        Completed on: {t.completedAt}
                      </small>
                    )}
                  </>
                )}
              </div>

              {editId !== t.id && (
                <button onClick={() => startEdit(t)}>✏️</button>
              )}
              <button onClick={() => deleteTask(t.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}

      {completed > 0 && (
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      )}
    </div>
  );
}

export default App;
