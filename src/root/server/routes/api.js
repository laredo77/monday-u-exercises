const express = require("express");

const {
  getAllTasks,
  addNewTask,
  deleteTask,
  deleteAllTasks,
  fetchPokemon,
  initClient,
} = require("../controllers/routesController");

const todoRouter = express.Router();

todoRouter.get("/", initClient);
todoRouter.get("/all", getAllTasks);
todoRouter.post("/pokemon", fetchPokemon);
todoRouter.post("/", addNewTask);
todoRouter.delete("/", deleteTask);
todoRouter.delete("/all", deleteAllTasks);

module.exports = todoRouter;
