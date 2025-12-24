import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext); // Get user from AuthContext

  const fetchNotifications = useCallback(async () => {
    if (!user) return; // Don't fetch if not logged in
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, user]);

  const addNotification = useCallback((message, type = "info") => {
    // For local transient notifications (optional, if we still want them)
    // Or we should assume everything goes through backend?
    // Let's keep distinct: Local toasts (transient) vs Backend (persistent).
    // The current UI mixes them.
    // Let's mix them in the state, but backend ones have IDs from DB.

    // Actually, for simplicity, let's just push to the list.
    // Ideally backend notifications should be separate or merged.
    // Given the UI is a dropdown list now, persistent is better.
    // "addNotification" is used by other components for toasts (e.g. "Login Success").
    // Those should probably NOT persist in backend.
    // But the user requested "budget exceed notification".

    // I will prepend local notifications to the list.
    const id = Date.now();
    setNotifications((prev) => [
      { _id: id, message, type, isLocal: true },
      ...prev,
    ]);

    // Auto remove local only
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => (n.isLocal ? n._id !== id : true))
      );
    }, 5000);
  }, []);

  const markAsRead = useCallback(
    async (id) => {
      try {
        await api.put(`/notifications/read/${id}`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        // Or remove it? Route says markAsRead. UI can filter or show grayed.
        // Navbar logic showed dot if length > 0. Usually unread count.
        // Let's update Navbar to show dot only if unread exists.
        fetchNotifications();
      } catch (e) {
        console.error(e);
      }
    },
    [fetchNotifications]
  );

  const removeNotification = useCallback(async (id) => {
    // If local
    setNotifications((prev) => {
      const target = prev.find((n) => n._id === id);
      if (target && target.isLocal) {
        return prev.filter((n) => n._id !== id);
      }
      return prev;
    });

    // If backend
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        fetchNotifications,
      }}
    >
      {children}
      {/* Toast Container rendered here or in AppLayout */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications
          .filter((n) => n.isLocal)
          .map((notif) => (
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
