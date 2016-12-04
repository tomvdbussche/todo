import mongoose from "mongoose";

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let schema = new Schema({
    name: String,
    completed: { type: Boolean, default: false},
    list: { type: ObjectId, ref: 'List'}
});

// Toggle completion of task
schema.methods.toggle = function (callback) {
    this.completed ^= true;
    this.save(callback);
};

// Also remove task from list if task is removed
schema.pre('remove', function (next) {
    this.model('List').update(
        {tasks: this._id},
        {$pull: {tasks: this._id}},
        {multi: true},
        next
    );
});

let Task = mongoose.model('Task', schema);

export default Task;