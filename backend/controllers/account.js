const express = require('express');
const router = express.Router();

const { verifyToken, generateToken } = require('../utils/jwt');
const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const ACCESS_EXP = parseInt(process.env.JWT_ACCESS_TOKEN_EXP);
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
const REFRESH_EXP = parseInt(process.env.JWT_REFRESH_TOKEN_EXP);

const Account = require('../models/account.js');

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'test.22.11.2021@gmail.com',
    pass: '18CNTNWNC'
  }
});

router.post("/google", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const { name, email } = ticket.getPayload();

    let [account] = await Account.find({ email }).exec();
    if (!account) {
      const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);
      account = new Account({ display_name: name, email, refresh_token: jwtRefreshToken, role: 'teacher' });
      await account.save();
    }

    if (account.status === 'banned') {
      return res.status(402).send({
        message: 'Your account has been banned.'
      });
    }

    const { _id, role } = account;
    const jwtPayload = { id: _id, role };
    const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);
    const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);

    account.refresh_token = jwtRefreshToken;
    await account.save();

    return res.status(201).json({
      jwtAccessToken,
      jwtRefreshToken,
      email: account.email,
      name: account.display_name,
      role: account.role
    });
  } catch (e) {
    return res.status(401);
  }

})

router.post('/register', async (req, res) => {
  const rs = await Account.find({ email: req.body.email }).exec();
  if (rs.length > 0) {
    res.status(409).json('email already exist!');
    return;
  }

  const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);
  const newAccount = new Account({ ...req.body, refresh_token: jwtRefreshToken, status: 'Unactivated' });
  const { _id, role } = await newAccount.save();
  const jwtPayload = { id: _id.toString(), role };
  const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);

  var mailOptions = {
    from: 'test.22.11.2021@gmail.com',
    to: req.body.email,
    subject: 'Account Activation',
    text:
      'Please go to this link to activate your account: http://localhost:3000/activateAccount/' +
      _id
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent Success');
    }
  });
  return res.status(201).json({
    message: 'Register account successfully',
    jwtAccessToken,
    jwtRefreshToken
  });
});

router.get('/activate', async (req, res) => {
  try {
    const accountId = req.query.id;
    const account = await Account.findById(accountId);
    account.status = 'Activated';
    await account.save();
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Activate failed"
    });
  }
})

router.post('/forgotPassword', async (req, res) => {
  try {
    const email = req.body.email;
    const account = await Account.findOne({ email: email });
    if (account === null) {
      return res.status(401).send({
        message: "You haven't register with this email yet."
      });
    }
    console.log(account);
    var mailOptions = {
      from: 'test.22.11.2021@gmail.com',
      to: req.body.email,
      subject: 'Reset Password',
      text:
        'Please go to this link to reset your password: http://localhost:3000/resetPassword/' +
        account._id
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent Success');
      }
    });
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Process failed."
    })
  }
})

router.post('/resetPassword', async (req, res) => {
  try {
    const id = req.body.id;
    const newPassword = req.body.newPassword;
    const account = await Account.findById(id);
    if (account === null) {
      return res.status(401).send({
        message: "You haven't register with this email yet."
      });
    }
    account.password = newPassword;
    await account.save();
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Reset password failed."
    })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [account] = await Account.find({ email: req.body.email }).exec();
  if (!account) {
    return res.status(401).json({
      message: 'Email does not exist'
    });
  }

  if (account.status === 'banned') {
    return res.status(402).send({
      message: 'Your account has been banned.'
    });
  }

  if (account.status === 'Unactivated') {
    return res.status(403).send({
      message: "Your account hasn't been activated."
    });
  }

  const validate = account.password === password;
  if (!validate) {
    return res.status(401).json({
      message: 'Incorrect password'
    });
  }

  const { _id, role } = account;
  const jwtPayload = { id: _id, role };
  const jwtAccessToken = await generateToken(jwtPayload, ACCESS_SECRET_KEY, ACCESS_EXP);
  const jwtRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);

  account.refresh_token = jwtRefreshToken;
  await account.save();
  return res.status(201).json({
    jwtAccessToken,
    jwtRefreshToken,
    email: account.email,
    name: account.display_name,
    role: account.role
  });
});

router.post('/refresh-token', async (req, res) => {
  const { accessToken, refreshToken } = req.body;
  try {
    await verifyToken(refreshToken, REFRESH_SECRET_KEY);
    const { id, role } = await verifyToken(accessToken, ACCESS_SECRET_KEY, true);
    const account = await Account.findById(id);

    if (refreshToken !== account.refresh_token) {
      throw Error();
    }
    const newAcessToken = await generateToken({ id, role }, ACCESS_SECRET_KEY, ACCESS_EXP);
    const newRefreshToken = await generateToken({}, REFRESH_SECRET_KEY, REFRESH_EXP);
    account.refresh_token = newRefreshToken;
    await account.save();

    res.status(201).json({
      access_token: newAcessToken,
      refresh_token: newRefreshToken
    })
  } catch (e) {
    res.status(401).json({
      message: 'error refresh'
    })
  }
})



module.exports = router;