const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');
const multer = require('multer');


router.get('/all', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/email/:email', async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.params.email}).
        then((user) => {
            return {
                id: user._id,
                profileImage: user.profileImage,
                name: user.name
            }
        })
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:id',[verifyToken], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        !user && res.status(500).json("User not found");

        if (user.role === "admin") res.status(200).json(user);
        else if (req.params.id === req.userId) {
            res.status(200).json( { 
                id: user._id,
                name: user.name, 
                profileImage: user.profileImage,
                friends: user.friends, 
                friendRequests: user.friendRequests
            });
        }   
        else res.status(200).json({ id: user._id, name: user.name, profileImage: user.profileImage });
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post('/:id', [verifyToken], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        !user && res.status(500).json("User not found");

        if (req.params.id === req.userId || user.role === "admin") {

        } else {
            res.status(500).json("You can only update your account");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User deleted successfully");
    // try {
    //     const user = await User.findById(req.params.id);
    //     !user && res.status(500).json("User not found");

    //     if (req.params.id === req.userId || user.role === "admin") {
    //         try { 
    //             await User.findByIdAndDelete(req.userId);
    //             res.status(200).json("User deleted successfully");
    //         } catch (err) {
    //             res.status(500).json(err)
    //         }
    //     } else {
    //         res.status(500).json("You cannot delete this account");
    //     }
    // } catch (err) {
    //     res.status(500).json(err);
    // }
})

router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        !user && res.status(500).json("User not found");

        const ok = true;

        if (ok || req.params.id === req.userId || req.isAdmin) {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (err) {
                    res.status(500).json(err);
                }
            }
            
            try {
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                });
                res.status(200).json(user);
            } catch (err) {
                res.status(500).json(err);
            } 
        } else {
            res.status(403).json("You can only update your account");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

// Update Profile Picture
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
})

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format are allowed!"));
        }
    }
});

router.post('/image/:id', upload.single("image"), async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { profileImage: req.file.filename});
        // await User.findByIdAndUpdate(req.params.id, { profileImage: req.file.filename });
        res.status(200).json(req.file.filename);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Get profile image
router.get('/image/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        !user && res.status(500).json("User not found!");

        res.status(200).json(user.profileImage);
    } catch (err) {
        res.status(500).json(err);
    }
})


// Friends

router.get('/friends/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id).then((user) => {return user.friends});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/friends/add', async (req, res) => {
    try {
        await User.findOneAndUpdate( {_id: req.body.user1}, { $addToSet: {friends: req.body.user2}}, {new:true})
        await User.findOneAndUpdate( {_id: req.body.user2}, { $addToSet: {friends: req.body.user1}}, {new:true})
        res.status(200).json("Updated successfully!");
    } catch (err) {
        res.status(500).json(err);
    }
})

// router.put('/friends/delete/:id', async (req, res) => {
//     try {
//         const data = await User.findOneAndUpdate(
//             { _id: req.params.id}, 
//             { $pullAll: { friends: [req.body.id] }}, {
//                 new: true
//             }
//         )
//         res.status(200).json(data);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// })

router.put('/friends/delete', async (req, res) => {
    try {
        await User.findOneAndUpdate(
            { _id: req.body.user1 },
            { $pullAll: { friends: [req.body.user2] }},
            { new: true }
        )
        await User.findOneAndUpdate(
            { _id: req.body.user2 }, 
            { $pullAll: { friends: [req.body.user1] }},
            { new: true }
        )
        res.status(200).json("Updated successfully!")
    } catch (err) {
        res.status(500).json(err);
    }
})

// Friend requests
router.get('/friendrequests/:id', async (req, res) => {
    try {
        const data =  await User.findById(req.params.id).then((user) => {return user.friendRequests});
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/friendrequests/add/:id', async (req, res) => {
    const today = new Date();
    try {
        const data = await User.findOneAndUpdate(
            { _id: req.params.id }, 
            { $addToSet: { friendRequests: { id: req.body.id, createdAt: today.toISOString() } } }, 
            { new: true}
        )
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/friendrequests/delete/:id', async (req, res) => {
    try {
        const data = await User.findOneAndUpdate(
            { _id: req.params.id }, 
            { $pull: { "friendRequests": {"id": req.body.id} } }, 
            { new: true}
        )
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;    