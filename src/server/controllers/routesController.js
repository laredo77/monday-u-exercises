const ItemManager = require("../../server/services/ItemManager");
const itemManager = new ItemManager();

async function getAllItems(req, res) {
  let data = await itemManager.getAll();
  if (!data) data = [];
  res.status(200).json(data);
}

async function fetchPokemon(req, res) {
  const response = await itemManager.fetchPokemon(req.body.pokemon);
  res.status(200).json(response);
}

async function addNewItem(req, res) {
  const response = await itemManager.checkInputString(req.body);
  res.status(200).json(response);
}

async function changeStatus(req, res) {
  const response = await itemManager.changeStatus(req.body);
  res.status(200).json(response);
}

async function deleteItem(req, res) {
  const response = await itemManager.deleteItem(req.body);
  res.status(200).json(response);
}

async function deleteAllItems(req, res) {
  const response = await itemManager.deleteAllItems();
  res.status(200).json(response);
}

module.exports = {
  getAllItems,
  addNewItem,
  deleteItem,
  deleteAllItems,
  fetchPokemon,
  changeStatus,
};
