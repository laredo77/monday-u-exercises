import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { PokemonClient } from "../DOM/PokemonClient.js";

import { mondayuMyLogger } from "../mondayu-mylogger/myLogger.js";
import chalk from 'chalk';

const pokemonClient = new PokemonClient();
const allPokemons = fetchAllPokemons();
const pokemonsDataMap = new Map();
const fs = require("fs").promises;
const inquirer = require('inquirer');

export async function checkInputString(taskToAdd) {
  const allTasks = await getAllTasks();
  // check if the input separate by commas in purpose
  // to fetch all pokemons (in case input is id's)
  if (checkForCommas(taskToAdd)) return;
  // input is numbers, try to fetch pokemon and represent the data
  if (isValidPokemonId(taskToAdd)) {
    const pokemonName = await fetchPokemon(taskToAdd);
    if (!pokemonName) return;
    taskToAdd = `Catch ${pokemonName}`;
  }
  // case the input is name of pokemon then fetch the data
  if ((await allPokemons).includes(taskToAdd)) {
    await fetchPokemon(taskToAdd);
    taskToAdd = `Catch ${taskToAdd}`;
  }
  // check if the input already exist, if so, return
  if (allTasks.length > 0) if (await checkForDuplicates(taskToAdd)) return;
  addTask(taskToAdd);
}

function checkForCommas(str) {
  if (str.indexOf(",") > -1) {
    let nanFlag = false;
    const tokens = str.split(",");
    for (const token of tokens) if (!isValidPokemonId(token)) nanFlag = true;
    if (!nanFlag) {
      // in case all the tokens are numbers then
      // check again the string and fetching pokemons
      // if not, just post the string as is
      for (const token of tokens) checkInputString(token);
      return true;
    }
  }
}

// check if string is valid pokemon id: positive integer
function isValidPokemonId(str) {
  if (
    !isNaN(str) &&
    parseInt(Number(str)) == str &&
    !isNaN(parseInt(str, 10)) &&
    str > 0
  )
    return true;
  return false;
}

// function that check if the input allready exist
// if so, alert the page the item display in
async function checkForDuplicates(taskToAdd) {
  const allTasks = await getAllTasks();
  if (allTasks.includes(taskToAdd)) {
    console.log(`The task: ${taskToAdd} already in the list`);
    return true;
  }
  return false;
}

// fetch pokemon from API, add it to the pokemons map and post its name with "Catch"
async function fetchPokemon(pokemonId) {
  const pokemonData = await pokemonClient.getPokemonData(pokemonId);
  if (!pokemonData) return;
  const catchPokemonTask = "Catch " + pokemonData.name;
  pokemonsDataMap.set(catchPokemonTask, pokemonData);
  return pokemonData.name;
}

// fetching all the pokemons and hold it in list
async function fetchAllPokemons() {
  const fetchedPokemons = await pokemonClient.getAllPokemons();
  const tmpArr = [];
  for (const pokemon of fetchedPokemons.results) tmpArr.push(pokemon.name);
  return tmpArr;
}

function addTask(taskToAdd) {
  mondayuMyLogger.log(taskToAdd);
  console.log(chalk.green("New todo added successfully"));
}

export async function deleteTask(taskToDelete) {
  const data = await fs.readFile("mylogger.txt", "utf8", function (err, data) {
    if (err) throw err;
  });
  const dataArr = data.split("\n");
  if (dataArr.includes(taskToDelete)) {
    const index = dataArr.indexOf(taskToDelete);
    dataArr.splice(index, 1);
  } else if (
    // check whether the input is positive number (index of item in the list)
    isValidPokemonId(taskToDelete) &&
    parseInt(taskToDelete) <= dataArr.length
  ) {
    dataArr.splice(parseInt(taskToDelete), 1);
  } else {
    console.log(`the task '${taskToDelete}' is not in the list`);
    return;
  }
  let dataString = "";
  for (const item of dataArr) dataString += `${item}\n`;
  while (dataString.indexOf('\n\n') > -1) dataString = dataString.replace('\n\n', '\n');
  fs.writeFile("mylogger.txt", dataString, function (err) {
    if (err) throw err; return;
  });
  console.log(chalk.red("Todo deleted successfully"));
}

export async function getAllTasks() {
  const tasks = await fs.readFile("mylogger.txt", "utf8", function (err, data) {
    if (err) throw err;
  });
  const arrTasks = tasks.split("\n");
  return arrTasks;
}

export function deleteAll() {
  // delete all task from logger
  fs.writeFile("mylogger.txt", "", function (err) {
    if (err) throw err; return;
  });
  console.log(chalk.red("All todo's deleted successfully"));
}
