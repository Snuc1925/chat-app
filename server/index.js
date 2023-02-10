const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { verifyToken, isAdmin } = require('./middlewares/authJwt');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const messagesRoute = require('./routes/messages');
const conversationsRoute = require('./routes/conversations');

mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true}, () => {
        console.log('Connected to MongoDB!');
    }
)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/message', messagesRoute);
app.use('/api/conversation', conversationsRoute);


app.listen(8000, () => {
    console.log("Backend server is running!");
});