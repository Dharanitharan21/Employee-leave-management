const con = require('../Database/dbconfig');

// ✅ Apply for leave (CREATE)
exports.applyLeave = async (req, res) => {
  const { user_id, leave_type_id, from_date, to_date, description } = req.body;

  if (!user_id || !leave_type_id || !from_date || !to_date) {
    return res.status(400).send("Missing required fields");
  }

  try {
    await con.query(
      `INSERT INTO leave_applications 
        (user_id, leave_type_id, from_date, to_date, description)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, leave_type_id, from_date, to_date, description || null]
    );
    res.status(201).send("Leave application submitted");
  } catch (err) {
    console.error("Leave apply error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Get all leave applications (for admin)
exports.getAllLeaveApplications = async (req, res) => {
  try {
    const [rows] = await con.query(
      `SELECT 
         la.*, 
         u.first_name, 
         u.last_name, 
         d.department_name, 
         lt.type_name 
       FROM leave_applications la
       JOIN users u ON la.user_id = u.id
       JOIN departments d ON u.department_id = d.id
       JOIN leave_types lt ON la.leave_type_id = lt.id
       ORDER BY la.created_at DESC`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching leave applications:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Get leave applications for a specific user
exports.getUserLeaveApplications = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await con.query(
      `SELECT la.*, lt.type_name 
       FROM leave_applications la
       JOIN leave_types lt ON la.leave_type_id = lt.id
       WHERE la.user_id = ?
       ORDER BY la.created_at DESC`,
      [user_id]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching user leave applications:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Approve or reject leave application
exports.updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status, admin_remarks} = req.body;
  const approved_by = req.user?.id

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).send("Invalid status");
  }

  try {
    await con.query(
      `UPDATE leave_applications 
       SET status = ?, admin_remarks = ?, approved_by = ?, approved_on = NOW() 
       WHERE id = ?`,
      [status, admin_remarks || null, approved_by, id]
    );
    res.status(200).send("Leave application status updated");
  } catch (err) {
    console.error("Update leave status error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Delete a leave application (by ID)
exports.deleteLeaveApplication = async (req, res) => {
  const { id } = req.params;
  try {
    await con.query('DELETE FROM leave_applications WHERE id = ?', [id]);
    res.status(200).send("Leave application deleted");
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Get single leave application by ID (optional)
exports.getLeaveApplicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await con.query(
     `SELECT 
         la.*, 
         u.first_name, 
         u.last_name, 
         d.department_name, 
         lt.type_name 
       FROM leave_applications la
       JOIN users u ON la.user_id = u.id
       JOIN departments d ON u.department_id = d.id
       JOIN leave_types lt ON la.leave_type_id = lt.id
       WHERE la.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).send("Leave application not found");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error fetching leave application:", err);
    res.status(500).send("Internal Server Error");
  }
};
// ✅ Get leave applications by status
exports.getApplicationsByStatus = async (req, res) => {
  const { status } = req.params;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).send("Invalid status type");
  }

  try {
    const [rows] = await con.query(
    `SELECT 
         la.*, 
         u.first_name, 
         u.last_name, 
         d.department_name, 
         lt.type_name 
       FROM leave_applications la
       JOIN users u ON la.user_id = u.id
       JOIN departments d ON u.department_id = d.id
       JOIN leave_types lt ON la.leave_type_id = lt.id
       WHERE la.status = ?
       ORDER BY la.created_at DESC`,
      [status]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching applications by status:", err);
    res.status(500).send("Internal Server Error");
  }
};
