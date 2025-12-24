import { createContext, useState, useContext, useCallback } from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Local only
  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [
      { _id: id, message, type, isLocal: true },
      ...prev,
    ]);

    // Auto remove
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
      {/* Toast Container rendered here or in AppLayout - Local Toasts Only */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className={`px-4 py-3 rounded-lg text-white shadow-lg transition-all transform animate-slideUp
              ${
                notif.type === "error"
                  ? "bg-red-600"
                  : notif.type === "success"
                  ? "bg-green-600"
                  : notif.type === "budget" || notif.type === "warning"
                  ? "bg-orange-500"
                  : "bg-blue-600"
              }
            `}
          >
            {notif.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
