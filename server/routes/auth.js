const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            profileImage: req.body.profileImage,
            role: (req.body.role ? req.body.role : 'user')
        });

        const user = await newUser.save();
        res.status(200).json("");
    } catch (err) {
        res.status(500).json({ err: err });
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json("User not found");
        } else {
            const checkPassword = await bcrypt.compare(req.body.password, user.password);
            !checkPassword && res.status(400).json("Wrong password");

            const token = jwt.sign({ id: user._id}, process.env.SECRET_KEY, {
                expiresIn: 3600
            });

            res.status(200).json({
                id: user._id,
                name: user.name,
                email: user.email,
                friends: user.friends,
                friendRequests: user.friendRequests,
                role: user.role,
                profileImage: user.profileImage,
                accessToken: token
            })
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;