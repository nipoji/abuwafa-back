// profileAdminControllers.js
const pool = require('../database/db');

const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { admin_name, email, username, password, role } = req.body;
    await pool.query('UPDATE admin SET admin_name = ?, email = ?, username = ?, password = ?, role = ? WHERE id_admin = ?', 
      [admin_name, email, username, password, role, adminId]);
    return res.send({ error: false, message: 'Admin profile updated successfully' });
  } catch (error) {
    console.error('Error updating admin profile:', error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

module.exports = {
  updateAdminProfile
};