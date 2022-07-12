const express = require("express");

const {
  getAllTasks,
  addNewTask,
  deleteTask,
  deleteAllTasks,
  fetchPokemon,
  changeStatus,
  getTaskStatus,
} = require("../controllers/routesController");

const todoRouter = express.Router();

todoRouter.get("/all", getAllTasks);
todoRouter.post("/pokemon", fetchPokemon);
todoRouter.post("/", addNewTask);
todoRouter.delete("/", deleteTask);
todoRouter.delete("/all", deleteAllTasks);
todoRouter.put("/status", changeStatus);
todoRouter.put("/getTaskStatus", getTaskStatus);

module.exports = todoRouter;
