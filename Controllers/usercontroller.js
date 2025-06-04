const con = require('../Database/dbconfig');
const bcrypt =require('bcrypt')

exports.signup = async (req, res) => {
   const {
    employee_code,
    first_name,
    last_name,
    email,
    mobile,
    password,
    gender,
    salary,
    department_id,
    birth_date,
    country,
    city,
    address,
    role = 'employee',
    employee_status = 'active',
  } = req.body;

if (!employee_code || !first_name || !email || !password) {
    return res.status(400).send("Required fields: employee_code, first_name, email, password");
  }
  try {
   const [existing] = await con.query(
      'SELECT * FROM users WHERE email = ? OR employee_code = ?',
      [email, employee_code]
    );

    if (existing.length > 0) {
      return res.status(409).send("Email or Employee Code already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await con.query(
     `INSERT INTO users 
        (employee_code, first_name, last_name, email, mobile, password, gender,salary, department_id, birth_date, country, city, address, role, employee_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)`,
      [
        employee_code,
        first_name,
        last_name || null,
        email,
        mobile || null,
        hashedPassword,
        gender || null,
        salary || null,
        department_id || null,
        birth_date || null,
        country || null,
        city || null,
        address || null,
        role,
        employee_status,
      ]
    )

    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({message:"Internal Server Error",error:err.message});
};
}
exports.getbyid = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await con.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send("user not found");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).send("Internal Server Error");
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await con.query(`
      SELECT 
        u.*, d.department_name 
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      ORDER BY u.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    mobile,
    gender,
    department_id,
    birth_date,
    country,
    city,
    address,
    role,
    employee_status
  } = req.body;

  try {
    // Fetch existing user
    const [existingUserRows] = await con.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUserRows.length === 0) {
      return res.status(404).send("User not found");
    }

    const existing = existingUserRows[0];

    // Update with fallback values
    await con.query(
      `UPDATE users SET 
        first_name = ?, last_name = ?, email = ?, mobile = ?, gender = ?, 
        department_id = ?, birth_date = ?, country = ?, city = ?, 
        address = ?, role = ?, employee_status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?`,
      [
        first_name ?? existing.first_name,
        last_name ?? existing.last_name,
        email ?? existing.email,
        mobile ?? existing.mobile,
        gender ?? existing.gender,
        department_id ?? existing.department_id,
        birth_date ?? existing.birth_date,
        country ?? existing.country,
        city ?? existing.city,
        address ?? existing.address,
        role ?? existing.role,
        employee_status ?? existing.employee_status,
        id
      ]
    );

    res.status(200).send("User updated successfully");
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.updateEmployeeStatus = async (req, res) => {
  const { id } = req.params;
  const { employee_status } = req.body;

  if (!['active', 'inactive'].includes(employee_status)) {
    return res.status(400).send("Invalid status");
  }

  try {
    await con.query(
      `UPDATE users SET employee_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [employee_status, id]
    );
    res.status(200).send("Employee status updated");
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).send("Current and new password are required");
  }

  try {
    const [rows] = await con.query('SELECT password FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send("User not found");

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) return res.status(401).send("Incorrect current password");

    const hashed = await bcrypt.hash(newPassword, 10);
    await con.query(
      `UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [hashed, id]
    );

    res.status(200).send("Password updated");
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({message:"Internal Server Error",error:err.message});
  }
};
