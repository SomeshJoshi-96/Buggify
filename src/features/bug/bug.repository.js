//Importing necessary modules and variables
import mongoose from "mongoose";
import { bugSchema } from "./bug.schema.js";
//Creating new bug database based on bug schema
export const BugModel = mongoose.model("Bug", bugSchema);

//Creating bug repository class
export default class BugRepository {
  //function to retrieve all required bugs
  async getBugs(projectId) {
    try {
      const bugs = await BugModel.find({ projectId: projectId });
      return bugs;
    } catch (err) {
      throw new Error();
    }
  }

  //function to create new bug document
  async createBug(data) {
    try {
      //creating new document from received data from controller
      let newBug = await new BugModel(data);
      newBug = await newBug.save();
      return newBug;
    } catch (err) {
      //passing any error other than validation
      throw new Error();
    }
  }
}
