const express = require("express");

const {
  getAllItems,
  addNewItem,
  deleteItem,
  deleteAllItems,
  fetchPokemon,
  changeStatus,
} = require("../controllers/routesController");

const todoRouter = express.Router();

todoRouter.get("/all", getAllItems);
todoRouter.post("/pokemon", fetchPokemon);
todoRouter.post("/", addNewItem);
todoRouter.delete("/", deleteItem);
todoRouter.delete("/all", deleteAllItems);
todoRouter.put("/status", changeStatus);

module.exports = todoRouter;
