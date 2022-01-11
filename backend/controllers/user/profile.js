const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const auth = require('../../middlewares/auth');

const Account = require('../../models/account.js');

router.get('/', auth, async (req, res) => {
    try {
        const account = res.locals.account;
        // console.log(account);
        const profileData = await Account.findById(account.id);
        // console.log(profileData);
        res.json(profileData);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Get failed'
        });
    }
});

router.post('/changePassword/', auth, async (req, res) => {
    try {
        const account = await Account.findById(res.locals.account.id);
        if (account.password === req.body.oldPass) {
            account.password = req.body.newPass;
            account.save();
        }
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Change pass failed'
        });
    }
});

module.exports = router