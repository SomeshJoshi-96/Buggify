//importing necessary libraries
import express from "express";
import BugController from "./bug.controller.js";
import validateBugRequest from "../../middlewares/bugValidationmiddleware.js";

//creating new bug route object
export const bugRouter = new express.Router();

//creating new bug contoller object
const bugController = new BugController();

//All paths to project

bugRouter.get("/getBugs", (req, res, next) => {
  bugController.getBugs(req, res, next);
});

bugRouter.post("/createBug", validateBugRequest, (req, res, next) => {
  bugController.createBug(req, res, next);
});
