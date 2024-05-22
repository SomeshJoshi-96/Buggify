//Importing necessary modules and variables
import mongoose from "mongoose";
import { projectSchema } from "./project.schema.js";

//Creating new project database based on project schema
export const ProjectModel = mongoose.model("Project", projectSchema);

//Creating project repository class
export default class ProjectRepository {
  //function to retrieve all required projects
  async getProjects(pageNumber, description, name, author) {
    try {
      const query = {};
      if (description !== "") {
        query.description = { $regex: new RegExp(description.trim(), "i") };
      }
      if (name !== "") {
        query.name = { $regex: new RegExp(name.trim(), "i") };
      }
      if (author !== "") {
        query.author = { $regex: new RegExp(author.trim(), "i") };
      }
      const projects = await ProjectModel.find(query)
        .sort({ created: -1 })
        .skip((pageNumber - 1) * 15)
        .limit(15);
      const totalCount = await ProjectModel.countDocuments(query);

      return {
        totalCount,
        projects,
      };
    } catch (err) {
      throw new Error();
    }
  }

  //function to create new project document
  async createProject(data) {
    try {
      //creating new document from received data from controller
      let newProject = await new ProjectModel(data);
      newProject = await newProject.save();
      return newProject;
    } catch (err) {
      //passing any error other than validation
      throw new Error();
    }
  }

  async getUniqueAuthors() {
    try {
      const projects = await ProjectModel.find();
      const uniqueAuthors = [
        ...new Set(projects.map((project) => project.author)),
      ];
      return uniqueAuthors;
    } catch (err) {
      throw new Error();
    }
  }
}
