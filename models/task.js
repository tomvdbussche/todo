import mongoose from "mongoose";

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let schema = new Schema({
    name: String,
    completed: Boolean,
    list: { type: ObjectId, ref: 'List'}
});

let Task = mongoose.model('Task', schema);

export default Task;