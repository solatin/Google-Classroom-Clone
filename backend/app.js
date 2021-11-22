const express = require('express');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const Class = require('./models/class.js');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'test.22.11.2021@gmail.com',
		pass: '18CNTNWNC'
	}
})

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

mongoose.connection.once('open', async (ref) => {
	console.log('Connected to mongo server!');
});

app.get('/classes', async (req, res) => {
	const listClass = await Class.find();
	res.json(listClass);
});

function makeCode(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

app.post('/classes', async (req, res) => {
	const newClass = new Class(req.body);
	newClass.code = makeCode(6);
	await newClass.save();
	res.status(202).json(newClass);
});

app.get('/sendInvite', async (req, res) => {
	var mailOptions = {
		from: 'ttdat.09.08.2000@gmail.com',
		to: 'bobyba20@gmail.com',
		subject: 'Invite to classroom',
		text: 'You have been invited to join our classroom. If you don\'t join, Fuck you!!!'
	}
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		}
		else {
			console.log("Email sent Success");
		}
	})
})

const host = '0.0.0.0';
const port = process.env.PORT || 8080;

app.listen(port, host, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
