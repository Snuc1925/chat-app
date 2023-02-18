const router = require("express").Router();
const Message = require("../models/Message");

router.post('/', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:messageId', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.messageId);
        res.status(200).json("Message deleted successfully");
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
