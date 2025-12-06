import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    let settings = await Settings.findOne({ user: userId });

    if (!settings) {
      settings = await Settings.create({ user: userId });
    }

    return res.status(200).json({
      success: true,
      settings,
    });

  } catch (error) {
    console.error("Get Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      currency,
      theme,
      language,
      monthlyGoal,
      notificationsEnabled,
    } = req.body;

    let settings = await Settings.findOne({ user: userId });

    if (!settings) {
      settings = await Settings.create({ user: userId });
    }

    
    if (currency) settings.currency = currency;
    if (theme) settings.theme = theme;
    if (language) settings.language = language;

    if (monthlyGoal !== undefined) {
      settings.monthlyGoal = monthlyGoal;
    }

    if (notificationsEnabled !== undefined) {
      settings.notificationsEnabled = notificationsEnabled;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });

  } catch (error) {
    console.error("Update Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
