const io = require('socket.io')(8900, {
    cors: {
        origin: "http://localhost:3000"
    },
})

let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({userId, socketId});
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        console.log({userId: userId, socketId: socket.id});
        io.emit("getUsers", users);
    })

    socket.on("sendMessage", (message) => {
        console.log(message);
        const user = getUser(message.receiverId);
        console.log(user);
        io.to(user.socketId).emit("getMessage", {
            chatId: message.chatId,
            sender: message.sender,
            text: message.text,
            unseenCount: message.unseenCount
        });
    })

    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})