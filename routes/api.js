import express from "express";
import List from "../models/list";
import Task from "../models/task";

let router = express.Router();

// Lists
router.route('/lists')
    .get(function (req, res, next) {
        console.log('Retrieving all lists');
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
    .post(function (req, res, next) {
        let list = new List(req.body);

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

router.get('/list/:list', function (req, res) {
    res.json(req.list);
});

router.post('/list/:list/tasks', function (req, res, next) {
    let task = new Task(req.body);
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

router.delete('/list/:list/tasks/:task', function (req, res) {
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

router.put('/list/:list/task/:task/toggle', function (req, res, next) {
    req.task.toggle(function (err, task) {
        if (err) {
            return next(err);
        } else {
            res.json(task);
        }
    });
});

router.route('/tasks')
    .get(function (req, res, next) {
        Task.find(function (err, tasks) {
            if (err) {
                return next(err);
            } else {
                res.json(tasks);
            }
        });
    });

router.route('/task/:task')
    .get(function (req, res) {
        res.json(req.task);
    })
    .delete(function (req, res) {
        req.task.remove(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json({message: 'Task deleted'});
            }
        });
    });

export default router;