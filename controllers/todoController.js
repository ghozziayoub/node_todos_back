//import libs
const express = require('express');
const bodyParser = require('body-parser');

//import connection to MongoDB and MySQL databases
var { mongoose } = require('../db/config');

//import Mongoose models
var { Todo } = require('../models/todo');
var { User } = require('../models/user');

const router = express.Router();

router.use(bodyParser.json());

router.post('/addTodo', (req, res) => {

    var todo = new Todo({
        text: req.body.text,
        _creator: req.body._userId
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

router.post('/todoList', (req, res) => {

    Todo.find({
        _creator: req.body.user_id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });

});

router.delete('/deleteTodo/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.body.user_id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

router.patch('/updateTodo/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.body.user_id
    }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    })
});

router.get('/', (req, res) => {
    res.send('From todo route')
})

module.exports = router;