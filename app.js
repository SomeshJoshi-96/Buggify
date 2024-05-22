// Importing all the necessary libraries
import express from "express";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import { projectRouter } from "./src/features/project/project.routes.js";
import { bugRouter } from "./src/features/bug/bug.routes.js";
import { appLevelErrorHandlerMiddleware } from "./src/middlewares/errorHandler.js";

dotenv.config();

//definining app/server
export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/api/project", projectRouter);
app.use("/api/bug", bugRouter);
app.use(appLevelErrorHandlerMiddleware);

//setting ejs view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("src", "views"));
