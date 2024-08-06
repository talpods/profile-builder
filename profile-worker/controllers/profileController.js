const ProfileService = require("../services/profileService");
exports.updateProfile = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;

    const updatedProfile = await ProfileService.updateProfile(slug, updateData);
    res.json(updatedProfile);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res
      .status(error.message.includes("not found") ? 404 : 500)
      .json({ error: error.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const { slug } = req.params;

    const profile = await ProfileService.getProfile(slug);
    res.json(profile);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res
      .status(error.message.includes("not found") ? 404 : 500)
      .json({ error: error.message });
  }
};
