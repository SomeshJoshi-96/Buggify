//importing necessary libraries and constants
import ProjectRepository from "./project.repository.js";
import { ProjectModel } from "./project.repository.js";

//Creating new instance of project repository class
const projectRepository = new ProjectRepository();

//Creating class for project
export default class ProjectController {
  //function to vreate a new project
  async createProject(req, res, next) {
    try {
      //extracting data from req body
      const data = req.body;
      const resp = await projectRepository.createProject(data);
      res.status(200).json({ newProject: resp });
    } catch (err) {
      next(err);
    }
  }
  //function to retrive required projects
  async getProjects(req, res, next) {
    try {
      //retrieving required projects from the database
      const pageNumber = req.query.pageNumber;

      const description = (req.query.description || "")
        .replace(/\s+/g, "")
        .toLowerCase();
      const name = (req.query.name || "").replace(/\s+/g, "").toLowerCase();

      const author = req.query.author || "";
      const resp = await projectRepository.getProjects(
        pageNumber,
        description,
        name,
        author
      );
      res.status(200).json(resp);
    } catch (err) {
      next(err);
    }
  }
  //function to get the homepage
  renderHomepage(req, res, next) {
    //just rendering the homepage
    res.status(200).render("projectHomepage");
  }

  //function to get all authors to add into filter
  async getUniqueAuthors(req, res, next) {
    try {
      const uniqueAuthors = await projectRepository.getUniqueAuthors();

      res.status(200).json(uniqueAuthors);
    } catch (error) {
      next(error);
    }
  }
}
