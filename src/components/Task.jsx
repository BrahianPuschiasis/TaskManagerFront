import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmDelete = ({ onConfirm, onCancel }) => (
  <div>
    <p className="mb-2">¿Estás seguro de que quieres eliminar esta tarea?</p>
    <div className="flex justify-end space-x-2">
      <button
        onClick={onConfirm}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
      >
        Confirmar
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
      >
        Cancelar
      </button>
    </div>
  </div>
);

const Task = ({ userId, token }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pendiente",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_HOST}/tasks`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las tareas");
        }

        const data = await response.json();
        const filteredTasks = data.filter(
          (task) => task.assignedUser === userId
        );
        setTasks(filteredTasks);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, [userId, token]);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Tarea eliminada con éxito");
    } catch (err) {
      setError(err.message);
      toast.error("Error al eliminar la tarea");
    }
  };

  const handleConfirmDelete = (taskId) => {
    toast(
      <ConfirmDelete
        onConfirm={() => {
          handleDelete(taskId);
          toast.dismiss();
        }}
        onCancel={() => toast.dismiss()}
      />,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsCreating(false);
    setUpdatedTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/tasks/${editingTask.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedTask.title,
            description: updatedTask.description,
            dueDate: updatedTask.dueDate,
            status: updatedTask.status,
            assignedUser: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la tarea");
      }

      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...updatedTask } : task
        )
      );
      setEditingTask(null);
      toast.success("Tarea actualizada con éxito");
    } catch (err) {
      setError(err.message);
      toast.error("Error al actualizar la tarea");
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/tasks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedTask.title,
            description: updatedTask.description,
            dueDate: updatedTask.dueDate,
            status: updatedTask.status,
            assignedUser: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la tarea");
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setIsCreating(false);
      toast.success("Tarea creada con éxito");
    } catch (err) {
      setError(err.message);
      toast.error("Error al crear la tarea");
    }
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingTask(null);
    setUpdatedTask({
      title: "",
      description: "",
      dueDate: "",
      status: "Pendiente",
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-center mb-4">
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Crear tarea
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {(editingTask || isCreating) && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 z-50">
            <h3 className="text-xl font-bold mb-4">
              {isCreating ? "Crear Tarea" : "Editar Tarea"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Título</label>
              <input
                type="text"
                value={updatedTask.title}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Descripción</label>
              <textarea
                value={updatedTask.description}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                Fecha Límite
              </label>
              <input
                type="date"
                value={updatedTask.dueDate}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, dueDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Estado</label>
              <select
                value={updatedTask.status}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, status: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Pending">Pendiente</option>
                <option value="Completed">Completada</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsCreating(false);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              {isCreating ? (
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Crear
                </button>
              ) : (
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Actualizar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="relative bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500"
            >
              <button
                onClick={() => handleConfirmDelete(task.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full transition-colors"
              >
                🗑️
              </button>
              <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">
                Fecha límite: {task.dueDate}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-lg ${
                  task.status === "Completada"
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {task.status}
              </span>
              <div className="text-right mt-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No tienes tareas asignadas
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Task;
