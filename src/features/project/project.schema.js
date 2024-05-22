//Creation of Project Schema with fields name ,description, author

//importing necessary modules
import mongoose from "mongoose";

export const projectSchema = new mongoose.Schema({
  name: {
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
});
