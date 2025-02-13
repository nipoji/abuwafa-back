// profileTutorControllers.js
const bcrypt = require("bcrypt");
const pool = require("../database/db");

const getTutorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT * FROM tutors");
    if (rows.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: "Tutor profile not found" });
    }
    return res.send({
      error: false,
      message: "Profile fetched successfully",
      profile: rows,
    });
  } catch (error) {
    console.error("Error fetching tutor profile:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const getTutorProfileById = async (req, res) => {
  try {
    const { id_tutor } = req.query; //

    if (!id_tutor) {
      return res
        .status(400)
        .send({ error: true, message: "Tutor ID is required" });
    }

    const [rows] = await pool.query("SELECT * FROM tutors WHERE id_tutor = ?", [
      id_tutor,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: "Tutor profile not found" });
    }

    return res.send({
      error: false,
      message: "Profile fetched successfully",
      profile: rows[0],
    });
  } catch (error) {
    console.error("Error fetching tutor profile by ID:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const createTutorProfile = async (req, res) => {
  try {
    const {
      tutor_name,
      phone_tutor,
      email,
      address,
      status,
      courses_type,
      bank,
      no_rek,
      username,
      password,
      role,
    } = req.body;
    const userId = req.user.id;
    await pool.query(
      `INSERT INTO tutors (id_tutor, tutor_name, phone_tutor, email, address, status, courses_type, bank, no_rek, username, password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        tutor_name,
        phone_tutor,
        email,
        address,
        status,
        courses_type,
        bank,
        no_rek,
        username,
        password,
        role,
      ]
    );
    return res.send({
      error: false,
      message: "Tutor profile created successfully",
    });
  } catch (error) {
    console.error("Error creating tutor profile:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const updateTutorProfile = async (req, res) => {
  try {
    const { id } = req.params; // Get tutor ID from route parameter
    let updates = req.body;

    if (!id) {
      return res.status(400).send({ error: true, message: "Tutor ID is required" });
    }

    // Jika tutor mengupdate password, hash terlebih dahulu
    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    // Update hanya field yang diberikan
    const fields = Object.keys(updates)
      .filter((key) => updates[key] !== undefined)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates).filter((value) => value !== undefined);

    if (fields.length === 0) {
      return res.status(400).send({ error: true, message: "No valid fields to update" });
    }

    const [result] = await pool.query(
      `UPDATE tutors SET ${fields} WHERE id_tutor = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: true, message: "Tutor profile not found" });
    }

    return res.send({ error: false, message: "Tutor profile updated successfully" });
  } catch (error) {
    console.error("Error updating tutor profile:", error.message);
    return res.status(500).send({ error: true, message: "Internal server error" });
  }
};

const deleteTutorProfile = async (req, res) => {
  try {
    const { id } = req.params; // Get the tutor ID from the route parameter

    if (!id) {
      return res
        .status(400)
        .send({ error: true, message: "Tutor ID is required" });
    }

    const [result] = await pool.query("DELETE FROM tutors WHERE id_tutor = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ error: true, message: "Tutor profile not found" });
    }

    return res.send({
      error: false,
      message: "Tutor profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tutor profile:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  getTutorProfile,
  getTutorProfileById,
  createTutorProfile,
  updateTutorProfile,
  deleteTutorProfile,
};
