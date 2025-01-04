// profileStudentControllers.js
const pool = require('../database/db');

const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Decoded ID from token
    console.log("Decoded user ID:", userId); // Log for debugging

    const [rows] = await pool.query('SELECT * FROM students WHERE id_student = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send({ error: true, message: 'Student profile not found' });
    }

    return res.send({ error: false, message: 'Profile fetched successfully', profile: rows[0] });
  } catch (error) {
    console.error('Error fetching student profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const createStudentProfile = async (req, res) => {
  try {
    const { student_name, phone_student, parent_name, city, address, status, package, school, grade, curriculum, username, password, role } = req.body;
    const userId = req.user.id;
    await pool.query(
      `INSERT INTO students (id_student, student_name, phone_student, parent_name, city, address, status, package, school, grade, curriculum, username, password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, student_name, phone_student, parent_name, city, address, status, package, school, grade, curriculum, username, password, role]
    );
    return res.send({ error: false, message: 'Student profile created successfully' });
  } catch (error) {
    console.error('Error creating student profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    await pool.query(`UPDATE students SET ${fields} WHERE id_student = ?`, [...values, userId]);
    return res.send({ error: false, message: 'Student profile updated successfully' });
  } catch (error) {
    console.error('Error updating student profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const deleteStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('DELETE FROM students WHERE id_student = ?', [userId]);
    return res.send({ error: false, message: 'Student profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting student profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

module.exports = {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
  deleteStudentProfile
};