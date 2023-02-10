const router = require('express').Router();
const Conversation = require('../models/Conversation');
const User = require('../models/User');

router.post('/', async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.firstUser, req.body.secondUser],
    })

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
})

// optimal??? 
router.get('/:userId', async (req, res) => {
    try {
        Conversation.find({ members: { $in: req.params.userId}}). 
            then((async (conversations) => {
                const conversationsData = await Promise.all(
                    conversations.map(async (c) => {
                        const userId = c.members.find((userId) => userId !== req.params.userId);
                        const cData = User.findById(userId).then((friend) => {
                            const data = {
                                chatId: c._id,
                                chatUser: {
                                    id: friend._id,
                                    name: friend.name,
                                    profileImage: friend.profileImage
                                }
                            }
                            return data;
                        })
                        return cData;
                    })
                )
                res.status(200).json(conversationsData);
            }))
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $all: [req.params.firstUserId, req.params.secondUserId]}
        })
        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;