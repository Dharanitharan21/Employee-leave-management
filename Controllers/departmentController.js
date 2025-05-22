const con = require('../Database/dbconfig');

// CREATE - Add new department
exports.addDepartment = async (req, res) => {
  const { dept_code, department_name, short_name } = req.body;
  if (!dept_code || !department_name) {
    return res.status(400).send("Department code and name are required");
  }

  try {
    const [existing] = await con.query('SELECT * FROM departments WHERE dept_code = ?', [dept_code]);
    if (existing.length > 0) return res.status(409).send("Department code already exists");

    await con.query(
      'INSERT INTO departments (dept_code, department_name, short_name) VALUES (?, ?, ?)',
      [dept_code, department_name, short_name || null]
    );

    res.status(201).send("Department added successfully");
  } catch (err) {
    console.error("Add department error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// READ - List all departments
exports.listDepartments = async (req, res) => {
  try {
    const [rows] = await con.query('SELECT * FROM departments');
    res.status(200).json(rows);
  } catch (err) {
    console.error("Fetch departments error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// READ - Get a single department by ID
exports.getDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await con.query('SELECT * FROM departments WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send("Department not found");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Get department error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// UPDATE - Update a department
exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { dept_code, department_name, short_name } = req.body;

  // if (!dept_code || !department_name) {
  //   return res.status(400).send("Department code and name are required");
  // }

  try {
     const [existingUserRows] = await con.query('SELECT * FROM departments WHERE id = ?', [id]);
    if (existingUserRows.length === 0) {
      return res.status(404).send("User not found");
    }

    const existing = existingUserRows[0];
    await con.query(
      `UPDATE departments 
       SET dept_code = ?, department_name = ?, short_name = ?, updated_at = NOW() 
       WHERE id = ?`,
      [dept_code ?? existing.dept_code, department_name ?? existing.department_name, short_name ?? existing.short_name, id]
    );
    res.status(200).send("Department updated successfully");
  } catch (err) {
    console.error("Update department error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// DELETE - Delete a department
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await con.query('SELECT * FROM departments WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).send("Department not found");

    await con.query('DELETE FROM departments WHERE id = ?', [id]);
    res.status(200).send("Department deleted successfully");
  } catch (err) {
    console.error("Delete department error:", err);
    res.status(500).send("Internal Server Error");
  }
};
