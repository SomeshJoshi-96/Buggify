//importing necessary libraries
import express from "express";
import ProjectController from "./project.controller.js";
import validateProjectRequest from "../../middlewares/project.Validationmiddleware.js";

//creating new project route object
export const projectRouter = new express.Router();

//creating new project contoller object
const projectController = new ProjectController();

//All paths to project
projectRouter.get("/", (req, res, next) => {
  projectController.renderHomepage(req, res, next);
});

projectRouter.get("/getProjects", (req, res, next) => {
  projectController.getProjects(req, res, next);
});

projectRouter.post(
  "/createProject",
  validateProjectRequest,
  (req, res, next) => {
    projectController.createProject(req, res, next);
  }
);

projectRouter.get("/getUniqueAuthors", (req, res, next) => {
  projectController.getUniqueAuthors(req, res, next);
});
