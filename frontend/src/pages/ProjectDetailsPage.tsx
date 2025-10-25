import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { TaskItem } from "../models/models";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const fetchTasks = async () => {
    const res = await api.get<TaskItem[]>(`/tasks/project/${id}`);
    const sortedTasks = sortTasks(res.data);
    setTasks(sortedTasks);
  };

  const sortTasks = (tasks: TaskItem[]) => {
    return tasks.sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;

      if (a.isCompleted === b.isCompleted) {
        if (!a.isCompleted && !b.isCompleted) {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        if (a.isCompleted && b.isCompleted) {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
      }

      return 0;
    });
  };

  const fetchProjectTitle = async () => {
    const res = await api.get(`/projects/${id}`);
    setProjectTitle(res.data.title);
  };

  const addTask = async () => {
    if (!title) return;

    const taskData: any = {
      title,
      projectId: Number(id),
    };

    if (dueDate) {
      taskData.dueDate = dueDate;
    }

    await api.post("/tasks", taskData);
    setTitle("");
    setDueDate("");
    fetchTasks();
  };

  const toggleTask = async (task: TaskItem) => {
    await api.put(`/tasks/${task.id}`, { isCompleted: !task.isCompleted });
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    const sortedTasks = sortTasks(updatedTasks);
    setTasks(sortedTasks);
  };

  const deleteTask = async (taskId: number) => {
    await api.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  const startEditing = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate || "");
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDueDate("");
  };

  const saveTaskEdit = async (taskId: number) => {
    if (!editTitle.trim()) return;

    const updateData: any = { title: editTitle };

    if (editDueDate) {
      updateData.dueDate = editDueDate;
    }

    await api.put(`/tasks/${taskId}`, updateData);
    setEditingTaskId(null);
    setEditTitle("");
    setEditDueDate("");
    fetchTasks();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchTasks();
    fetchProjectTitle();
  }, [id]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{projectTitle}</h1>
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to Projects
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Add New Task
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((t) => {
              const due = t.dueDate ? new Date(t.dueDate) : null;
              const isOverdue = due && !t.isCompleted && due < new Date();
              const isEditing = editingTaskId === t.id;

              return (
                <li
                  key={t.id}
                  className={`flex justify-between items-center p-3 border rounded-lg shadow-sm bg-white ${
                    t.isCompleted ? "opacity-60" : ""
                  }`}
                >
                  {isEditing ? (
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border p-2 rounded w-full"
                        placeholder="Task title"
                      />
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="border p-2 rounded w-full"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveTaskEdit(t.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={t.isCompleted}
                          onChange={() => toggleTask(t)}
                          className="w-5 h-5"
                        />
                        <div className="flex flex-col">
                          <p
                            className={`font-medium text-gray-800 ${
                              t.isCompleted ? "line-through" : ""
                            }`}
                          >
                            {t.title}
                          </p>

                          {due && (
                            <span
                              className={`
                                mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded
                                ${
                                  t.isCompleted
                                    ? "bg-gray-300 text-gray-700"
                                    : isOverdue
                                    ? "bg-red-500 text-white"
                                    : due.getTime() - new Date().getTime() <=
                                      2 * 24 * 60 * 60 * 1000
                                    ? "bg-yellow-400 text-blue-900"
                                    : "bg-green-200 text-green-800"
                                }
                              `}
                            >
                              {isOverdue
                                ? "Overdue: " + due.toLocaleDateString()
                                : "Due: " + due.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(t)}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
