const con = require('../Database/dbconfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const jwt_token = (id) => {
 return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const [results] = await con.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    const user = results[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Incorrect password");
    }

    const token = jwt_token(user.id);

    // Successful login response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        employee_code: user.employee_code,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        department_id: user.department_id
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error");
  }
};
