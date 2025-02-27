// profileAdminControllers.js
const bcrypt = require("bcrypt");
const pool = require('../database/db');

const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    let { admin_name, email, username, password, role } = req.body;

    if (!adminId) {
      return res.status(400).send({ error: true, message: "Admin ID is required" });
    }

    // Jika admin mengupdate password, hash terlebih dahulu
    if (password) {
      const saltRounds = 10;
      password = await bcrypt.hash(password, saltRounds);
    }

    // Update hanya field yang diberikan
    const updates = { admin_name, email, username, password, role };
    const fields = Object.keys(updates)
      .filter((key) => updates[key] !== undefined)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates).filter((value) => value !== undefined);

    if (fields.length === 0) {
      return res.status(400).send({ error: true, message: "No valid fields to update" });
    }

    const [result] = await pool.query(
      `UPDATE admin SET ${fields} WHERE id_admin = ?`,
      [...values, adminId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: true, message: "Admin profile not found" });
    }

    return res.send({ error: false, message: "Admin profile updated successfully" });
  } catch (error) {
    console.error("Error updating admin profile:", error.message);
    return res.status(500).send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  updateAdminProfile
};