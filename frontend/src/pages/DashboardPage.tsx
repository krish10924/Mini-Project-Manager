import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Project } from "../models/models";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [descValue, setDescValue] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await api.get<Project[]>("/projects");
      setProjects(res.data);
    } catch (error: any) {
      console.error("Failed to fetch projects:", error);
      if (error.response?.status === 401) {
        return;
      }
      alert("Failed to load projects. Please try again.");
    }
  };

  const addProject = async () => {
    if (!title.trim()) return;
    try {
      await api.post("/projects", { title });
      setTitle("");
      fetchProjects();
    } catch (error: any) {
      console.error("Failed to create project:", error);
      if (error.response?.status === 401) {
        return;
      }
      alert("Failed to create project. Please try again.");
    }
  };

  const deleteProject = async (id: number) => {
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const saveDescription = async (projectId: number) => {
    await api.put(`/projects/${projectId}`, { description: descValue });
    setEditingId(null);
    setDescValue("");
    fetchProjects();
  };

  const getProjectStatus = (project: Project) => {
    const tasks = project.tasks || [];

    if (tasks.length === 0) {
      return null;
    }

    const completedTasks = tasks.filter((task) => task.isCompleted);

    if (completedTasks.length === tasks.length) {
      return {
        text: "Project Completed",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    } else {
      return {
        text: "Tasks Pending",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProjects();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-white shadow px-6 py-4 sticky top-0">
        <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="New project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 flex-1 rounded-l"
          />
          <button
            onClick={addProject}
            className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul className="space-y-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-semibold text-lg">{p.title}</h2>
                  {(() => {
                    const status = getProjectStatus(p);
                    return status ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}
                      >
                        {status.text}
                      </span>
                    ) : null;
                  })()}
                </div>

                {editingId === p.id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="border p-2 rounded w-full"
                      rows={2}
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      placeholder="Enter project description..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveDescription(p.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setDescValue("");
                        }}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {p.description ? (
                      <p className="text-gray-700 text-sm">{p.description}</p>
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No description yet
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setEditingId(p.id);
                        setDescValue(p.description || "");
                      }}
                      className="text-blue-500 hover:underline text-sm mt-2"
                    >
                      Edit Description
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  View Tasks
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
