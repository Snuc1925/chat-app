const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(500).json('No token provided!');
    } 

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json(err);
        }
        req.userId = decoded.id; 
        next();
    });
}

isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    !user && res.status(404).json("User not found");

    if (user.role !== "admin") {
        req.isAdmin = false;
    } else {
        req.isAdmin = true;
    }

    next();
}

module.exports = { verifyToken, isAdmin };

