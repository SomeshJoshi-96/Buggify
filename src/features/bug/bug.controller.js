//importing necessary libraries and constants
import BugRepository from "./bug.repository.js";

//Creating new instance of bug repository class
const bugRepository = new BugRepository();

//Creating class for project
export default class BugController {
  //function to vreate a new project
  async createBug(req, res, next) {
    try {
      //extracting data from req body
      const data = { ...req.body, projectId: req.query.projectId };
      data.labels = req.body.labels.split(",");
      console.log(data);
      const resp = await bugRepository.createBug(data);
      res.status(200).json({ newBug: resp });
    } catch (err) {
      next(err);
    }
  }
  //function to retrive required bugs
  async getBugs(req, res, next) {
    try {
      //retrieving required bugs from the database
      const projectId = req.query.projectId;
      const resp = await bugRepository.getBugs(projectId);
      res.status(200).render("bugPage", { bugs: resp });
    } catch (err) {
      next(err);
    }
  }
}
