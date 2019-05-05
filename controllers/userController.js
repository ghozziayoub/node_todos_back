//import libs
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//import connection to MongoDB and MySQL databases
var { mongoose } = require('../db/config');

//import Mongoose models
var { User } = require('../models/user');

const router = express.Router();

router.use(bodyParser.json());

router.post('/subscribe', (req, res) => {
    var body = _.pick(req.body, ['firstname', 'lastname', 'email', 'tel', 'password']);
    var user = new User(body);

    user.save().then(() => {
        res.status(200).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

router.post('/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var email = body.email;
    var password = body.password;

    User.findOne({ email }).then((user) => {
        if (!user) {
            res.status(400).send('email not found');
        }
        
        bcrypt.compare(password, user.password, (err, re) => {
            if (re) {
                var access = 'auth';
                var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();
                user.tokens.push({ access, token });

                user.save().then(() => {
                    res.send({ token });
                });
            } else {
                res.status(400).send('password incorrect');
            }
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.post('/logout', (req, res) => {

    
    let token = req.body.token;

    console.log(token);
    
    User.findOneAndUpdate({ 'tokens.token': token }, { tokens: '' }).then((user) => {
        if (!user) {
            return res.status(404).send('user not found');
        }

        res.status(200).send({ user });

    }).catch((e) => {
        res.status(400).send(e);
    });

});

router.post('/info', (req, res) => {
    let token = req.body.token;

    User.findOne({ 'tokens.token': token }).then((user) => {
        if (!user) {
            return res.status(404).send('user not found');
        }

        res.status(200).send(user);

    }).catch((e) => {
        res.status(400).send();
    });
});

router.get('/', (req, res) => {
    res.send('From user route')
})

module.exports = router;