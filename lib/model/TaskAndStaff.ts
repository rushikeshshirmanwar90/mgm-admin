import { model, models, Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StaffSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    require: true,
  },
  tasks: [TaskSchema],
});

export const Task = models.Task || model("Task", TaskSchema);
export const Staff = models.Staff || model("Staff", StaffSchema);
