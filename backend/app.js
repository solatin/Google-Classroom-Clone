const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Class = require('./models/class.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.jqf7i.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
);
console.log(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.jqf7i.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
);

mongoose.connection.once('open', async(ref) => {
    console.log('Connected to mongo server!');
});

app.get('/classes', async(req, res) => {
    const listClass = await Class.find();
    res.json(listClass);
});

app.post('/classes', async(req, res) => {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(202).json(newClass);
});

app.get('/class-details/:id/feed', async(req, res) => {
    // Get class data (class name, teacher name, announcements)

    const classData = await Class.findById(req.params.id);
    // console.log(classData);
    res.json(classData);
});

app.get('/class-details/:id/members', async(req, res) => {
    // Get members in class

    const classData = await Class.findById(req.params.id);
    // console.log(classData);
    res.json(classData);
})

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});