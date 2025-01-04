// profileTutorControllers.js
const pool = require('../database/db');

const getTutorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT * FROM tutors WHERE id_tutor = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send({ error: true, message: 'Tutor profile not found' });
    }
    return res.send({ error: false, message: 'Profile fetched successfully', profile: rows[0] });
  } catch (error) {
    console.error('Error fetching tutor profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const createTutorProfile = async (req, res) => {
  try {
    const { tutor_name, phone_tutor, email, address, city, status, courses_type, bank, no_rek, username, password, role } = req.body;
    const userId = req.user.id;
    await pool.query(
      `INSERT INTO tutors (id_tutor, tutor_name, phone_tutor, email, address, city, status, courses_type, bank, no_rek, username, password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, tutor_name, phone_tutor, email, address, city, status, courses_type, bank, no_rek, username, password, role]
    );
    return res.send({ error: false, message: 'Tutor profile created successfully' });
  } catch (error) {
    console.error('Error creating tutor profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const updateTutorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    await pool.query(`UPDATE tutors SET ${fields} WHERE id_tutor = ?`, [...values, userId]);
    return res.send({ error: false, message: 'Tutor profile updated successfully' });
  } catch (error) {
    console.error('Error updating tutor profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const deleteTutorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('DELETE FROM tutors WHERE id_tutor = ?', [userId]);
    return res.send({ error: false, message: 'Tutor profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutor profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

module.exports = {
  getTutorProfile,
  createTutorProfile,
  updateTutorProfile,
  deleteTutorProfile
};