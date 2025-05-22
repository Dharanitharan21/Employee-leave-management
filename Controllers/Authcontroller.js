const con = require('../Database/dbconfig')
const jwt = require('jsonwebtoken')
const {promisify} =require('util')

exports.protect = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (!token) {
            return res.status(401).json({ message: "You are not logged in!!! Please log in to get access" })
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const [rows] = await con.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'User not found.' });
        }
        req.user = rows[0]; 
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Unauthorized', error: err.message });
    }
} 