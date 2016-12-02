import express from "express";
import List from "../models/list";

let router = express.Router();

// Lists
router.route('/lists')
    // Retrieve all lists
    .get(function (req, res, next) {
        List.find(function (err, lists) {
            if (err) {
                return next(err);
            }

            res.json(lists);
        });
    })
    // Create new list
    .post(function (req, res, next) {
        let list = new List(req.body);

        list.save(function (err, list) {
            if (err) {
                return next(err);
            }

            res.json(list);
        });
    });

export default router;