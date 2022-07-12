const ItemManager = require("../../server/services/ItemManager");
const itemManager = new ItemManager();

async function getAllTasks(req, res) {
  let data = await itemManager.getAll();
  if (!data) data = [];
  res.status(200).json(data);
}

async function fetchPokemon(req, res) {
  const response = await itemManager.fetchPokemon(req.body.pokemonId);
  res.status(200).json(response);
}

async function addNewTask(req, res) {
  const response = await itemManager.checkInputString(req.body);
  res.status(200).json(response);
}

async function deleteTask(req, res) {
  const response = await itemManager.deleteTask(req.body);
  res.status(200).json(response);
}

async function deleteAllTasks(req, res) {
  const response = await itemManager.deleteAllTasks();
  res.status(200).json(response);
}

module.exports = {
  getAllTasks,
  addNewTask,
  deleteTask,
  deleteAllTasks,
  fetchPokemon,
};
