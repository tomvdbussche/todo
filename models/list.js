var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schema = new Schema({
    title: String,
    tasks: [{type: ObjectId, ref: 'Task'}]
});

// schema
//     .virtual('completed')
//     .get(function () {
//         return this.tasks.filter(function (task) {
//             return task.completed;
//         }).length;
//     });
//
// schema.set('toJSON', {virtuals: true});

var List = mongoose.model('List', schema);

module.exports = List;