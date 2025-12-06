import Notification from "../models/Notification.js";

export const createNotification = async (userId, title, message, type = "info") => {
    try {
        await Notification.create({
            user: userId,
            title,
            message,
            type,
        });
    } catch (error) {
        console.error("Create Notification Error:", error);
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });

    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.id;

        const notification = await Notification.findOne(
            {
                _id: notificationId,
                user: userId,
            }
        );
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }
        notification.isRead = true;

        await notification.save();
    
        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
        });
    } catch (error) {
        console.error("Mark as Read Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    const deleted = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });

  } catch (error) {
    console.error("Delete Notification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.deleteMany({ user: userId });

    return res.status(200).json({
      success: true,
      message: "All notifications cleared successfully",
    });

  } catch (error) {
    console.error("Clear All Notifications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

