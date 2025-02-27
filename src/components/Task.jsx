import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next"; 
import "react-toastify/dist/ReactToastify.css";



const Task = ({ userId, token }) => {
  const { t, i18n } = useTranslation(); 
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: t("pending"),
  });

  const ConfirmDelete = ({ onConfirm, onCancel }) => (
    <div>
      <p className="mb-2">{t('deleteConfirmation')}</p> 
      <div className="flex justify-end space-x-2">
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          {t("confirmDelete")}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
         { t("cancelDelete")}
        </button>
      </div>
    </div>
  );

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
          throw new Error(t("errorFetch"));
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
  }, [userId, token, t]);

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
        throw new Error(t("errorDelete"));
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success(t("taskDeleted"));
    } catch (err) {
      setError(err.message);
      toast.error(t("errorDelete"));
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
        throw new Error(t("errorUpdate"));
      }

      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...updatedTask } : task
        )
      );
      setEditingTask(null);
      toast.success(t("taskUpdated"));
    } catch (err) {
      setError(err.message);
      toast.error(t("errorUpdate"));
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
        throw new Error(t("errorCreate"));
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setIsCreating(false);
      toast.success(t("taskCreated"));
    } catch (err) {
      setError(err.message);
      toast.error(t("errorCreate"));
    }
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingTask(null);
    setUpdatedTask({
      title: "",
      description: "",
      dueDate: "",
      status: t("pending"),
    });
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-center mb-4">
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          {t("createTask")}
        </button>
        <button
          onClick={() => changeLanguage("es")}
          className="px-4 py-2 ml-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          ES
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className="px-4 py-2 ml-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          EN
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {(editingTask || isCreating) && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 z-50">
            <h3 className="text-xl font-bold mb-4">
              {isCreating ? t("createTask") : t("editTask")}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold">{t("title")}</label>
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
              <label className="block text-sm font-semibold">{t("description")}</label>
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
              <label className="block text-sm font-semibold">{t("dueDate")}</label>
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
              <label className="block text-sm font-semibold">{t("status")}</label>
              <select
                value={updatedTask.status}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, status: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Pending">{t("pending")}</option>
                <option value="Completed">{t("completed")}</option>
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
                {t("cancel")}
              </button>
              {isCreating ? (
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  {t("create")}
                </button>
              ) : (
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {t("update")}
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
                {t("dueDate")}: {task.dueDate}
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
                  {t("edit")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            {t("noTasks")}
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Task;
