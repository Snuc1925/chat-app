const router = require('express').Router();
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message');

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

router.get('/id/:conversationId', async (req, res) => {
    try {
        const data = await Conversation.findById(req.params.conversationId);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/unseen/:conversationId', async (req, res) => {
    try {
        Conversation.findByIdAndUpdate(req.params.conversationId, { $set: req.body}, function (err, data) {
            res.status(200).json(data);
        })
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
                        const data = 
                        Message.find({ conversationId: c._id }).sort({"createdAt": -1})
                        .then((messages) => {
                            return messages[0];
                        })
                        .then(async (lastMessage) => {
                            const cData = User.findById(userId).then((friend) => {
                                const cInfo = {
                                    chatId: c._id,
                                    chatUser: {
                                        id: friend._id,
                                        name: friend.name,
                                        profileImage: friend.profileImage
                                    },
                                    lastMessage: {
                                        own: (lastMessage.senderId === req.params.userId),
                                        text: (lastMessage.text),
                                        createdAt: lastMessage.createdAt
                                    },
                                    unseen: {
                                        own: (c.unseen.userId === req.params.userId),
                                        count: c.unseen.count
                                    }
                                }
                                return cInfo;
                            })
                            return cData;
                        })
                        return data;
                    })
                )
                const sortedConversations = conversationsData.sort((c1, c2) => { return c2.lastMessage.createdAt - c1.lastMessage.createdAt});
                res.status(200).json(sortedConversations);
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