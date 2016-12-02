import mongoose from "mongoose";

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let schema = new Schema({
    title: String,
    tasks: [{type: ObjectId, ref: 'Task'}]
});

let List = mongoose.model('List', schema);

export default List;