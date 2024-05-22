//Creation of Project Schema with fields name ,description, author

//importing necessary modules
import mongoose from "mongoose";

export const bugSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  author: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  labels: {
    type: [String],
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
});
