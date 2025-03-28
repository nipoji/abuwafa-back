// profileStudentControllers.js
const bcrypt = require("bcrypt");
const pool = require("../database/db");

const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Decoded ID from token
    console.log("Decoded user ID:", userId); // Log for debugging

    const [rows] = await pool.query("SELECT * FROM students");
    if (rows.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: "Student profile not found" });
    }

    return res.send({
      error: false,
      message: "Profile fetched successfully",
      profile: rows,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const getStudentProfileById = async (req, res) => {
  try {
    const { id } = req.params; // Get the student ID from query parameter

    if (!id) {
      return res
        .status(400)
        .send({ error: true, message: "Student ID is required" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM students WHERE id_student = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: "Student profile not found" });
    }

    return res.send({
      error: false,
      message: "Profile fetched successfully",
      profile: rows[0],
    });
  } catch (error) {
    console.error("Error fetching student profile by ID:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const createStudentProfile = async (req, res) => {
  try {
    const {
      student_name,
      phone_student,
      parent_name,
      address,
      status,
      package,
      school,
      grade,
      curriculum,
      username,
      password,
      role,
    } = req.body;
    const userId = req.user.id;
    await pool.query(
      `INSERT INTO students (id_student, student_name, phone_student, parent_name, address, status, package, school, grade, curriculum, username, password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        student_name,
        phone_student,
        parent_name,
        address,
        status,
        package,
        school,
        grade,
        curriculum,
        username,
        password,
        role,
      ]
    );
    return res.send({
      error: false,
      message: "Student profile created successfully",
    });
  } catch (error) {
    console.error("Error creating student profile:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params; // Get the student ID from the route parameter
    const updates = req.body;

    if (!id) {
      return res
        .status(400)
        .send({ error: true, message: "Student ID is required" });
    }

    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const fields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updates);

    const [result] = await pool.query(
      `UPDATE students SET ${fields} WHERE id_student = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ error: true, message: "Student profile not found" });
    }

    return res.send({
      error: false,
      message: "Student profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating student profile:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const deleteStudentProfile = async (req, res) => {
  try {
    const { id } = req.params; // Get the student ID from the route parameter

    if (!id) {
      return res
        .status(400)
        .send({ error: true, message: "Student ID is required" });
    }

    const [result] = await pool.query(
      "DELETE FROM students WHERE id_student = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .send({ error: true, message: "Student profile not found" });
    }

    return res.send({
      error: false,
      message: "Student profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student profile:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const getAllStudentStatusStatistic = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT status, COUNT(*) as count 
       FROM students 
       GROUP BY status`
    );

    const statistics = rows.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {});

    return res.send({
      error: false,
      message: "Student status statistics fetched successfully",
      statistics,
    });
  } catch (error) {
    console.error("Error fetching student status statistics:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  getStudentProfile,
  getStudentProfileById,
  getAllStudentStatusStatistic,
  createStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
};
