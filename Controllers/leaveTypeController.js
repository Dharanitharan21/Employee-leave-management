const con = require('../Database/dbconfig');


exports.addLeaveType = async (req, res) => {
  const { type_name, description } = req.body;

  if (!type_name) {
    return res.status(400).send("Leave type name is required");
  }

  try {
    const [existing] = await con.query('SELECT * FROM leave_types WHERE type_name = ?', [type_name]);
    if (existing.length > 0) return res.status(409).send("Leave type already exists");

    await con.query(
      'INSERT INTO leave_types (type_name, description) VALUES (?, ?)',
      [type_name, description || null]
    );
    res.status(201).send("Leave type added successfully");
  } catch (err) {
    console.error("Add leave type error:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.listLeaveTypes = async (req, res) => {
  try {
    const [rows] = await con.query('SELECT * FROM leave_types ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error("Fetch leave types error:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getLeaveType = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await con.query('SELECT * FROM leave_types WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send("Leave type not found");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Fetch single leave type error:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.updateLeaveType = async (req, res) => {
  const { id } = req.params;
  const { type_name, description } = req.body;



  try {
   const [existingUserRows] = await con.query('SELECT * FROM Leave_types WHERE id = ?', [id]);
    if (existingUserRows.length === 0) {
      return res.status(404).send("User not found");
    }

    const existing = existingUserRows[0];

    await con.query(
      `UPDATE leave_types SET type_name = ?, description = ?, updated_at = NOW() WHERE id = ?`,
      [type_name ?? existing.type_name, description ?? existing.description, id]
    );
    res.status(200).send("Leave type updated successfully");
  } catch (err) {
    console.error("Update leave type error:", err);
    res.status(500).send("Internal Server Error");
  }
};


exports.deleteLeaveType = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await con.query('SELECT * FROM leave_types WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).send("Leave type not found");

    await con.query('DELETE FROM leave_types WHERE id = ?', [id]);
    res.status(200).send("Leave type deleted successfully");
  } catch (err) {
    console.error("Delete leave type error:", err);
    res.status(500).send("Internal Server Error");
  }
};
