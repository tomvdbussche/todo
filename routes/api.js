var express = require("express");
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'smbolganXrC13CUmJxYFUrgGG9HIBCuj', userProperty: 'payload'});

var List = require("../models/list");
var Task = require("../models/task");
var User = require("../models/user");


router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function (err){
        // if(err){ return next(err); }
    if (err) {
        return res.status(400).json({message: 'Username unavailable'});
    }

        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function (req, res, next) {
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

// Lists
router.route('/lists')
    .get(auth, function (req, res, next) {
        List.find()
            .populate({
                path: 'tasks',
                populate: {
                    path: 'list',
                    model: 'List'
                }
            })
            .exec(function (err, lists) {
                if (err) {
                    return next(err);
                } else {
                    res.json(lists);
                }
            });
    })
    .post(auth, function (req, res, next) {
        var list = new List(req.body);

        list.save(function (err, list) {
            if (err) {
                return next(err);
            } else {
                res.json(list);
            }
        });
    });

router.param('list', function (req, res, next, id) {
    List.findById(id)
        .populate('tasks')
        .exec(function (err, list) {
            if (err) {
                return next(err);
            } else if (!list) {
                return next(new Error('List does not exist'));
            } else {
                req.list = list;
                return next();
            }
        });
});

router.get('/list/:list', auth, function (req, res) {
    res.json(req.list);
});

router.delete('/list/:list', auth, function (req, res) {
    List.remove({
        _id: req.list._id
    }, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'List deleted'});
        }
    });
});

router.put('/list/:list/rename', auth, function (req, res) {
    var list = req.list;
    var title = req.body.title;

    list.title = title;

    list.save(function (err, list) {
        if (err) {
            res.send(err);
        } else {
            res.json(list);
        }
    });
});

router.post('/list/:list/tasks', auth, function (req, res, next) {
    var task = new Task(req.body);
    task.list = req.list;

    task.save(function (err, task) {
        if (err) {
            return next(err);
        }

        req.list.tasks.push(task._id);
        req.list.save(function (err) {
            if (err) {
                return next(err);
            }

            res.json(task);
        });
    });
});

router.param('task', function (req, res, next, id) {
    Task.findById(id)
        .populate({
            path: 'list',
            populate: {
                path: 'tasks',
                model: 'Task'
            }
        })
        .exec(function (err, task) {
            if (err) {
                return next(err);
            } else if (!task) {
                return next(new Error('Task does not exist'));
            } else {
                req.task = task;
                return next();
            }
        });
});

router.delete('/list/:list/task/:task', auth, function (req, res) {
    Task.remove({
        _id: req.task._id
    }, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json({message: 'Task deleted'});
        }
    });
});

router.get('/list/:list/task/:task/toggle', auth, function (req, res) {
    req.task.toggle(function (err, task) {
        if (err) {
            res.send(err);
        } else {
            res.json(task);
        }
    });
});

router.route('/tasks')
    .get(auth, function (req, res, next) {
        Task.find(function (err, tasks) {
            if (err) {
                return next(err);
            } else {
                res.json(tasks);
            }
        });
    });

router.route('/task/:task')
    .get(auth, function (req, res) {
        res.json(req.task);
    })
    .delete(auth, function (req, res) {
        req.task.remove(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json({message: 'Task deleted'});
            }
        });
    });

module.exports = router;