import mongoose from "mongoose";

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let schema = new Schema({
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

let List = mongoose.model('List', schema);

export default List;