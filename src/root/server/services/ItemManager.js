const PokemonClient = require("../clients/PokemonClient");

const tasksFile = "tasks.json";

const fs = require("fs").promises;
const fsWithOutPromises = require("fs");

module.exports = class ItemManager {
  constructor() {
    this.pokemonClient = new PokemonClient();
    this.fetchAllPokemons();
  }

  async initClient() {
    //     var webProjects = JSON.parse(fs.readFileSync('webProjects.json'));
    // let json = JSON.parse(file);
    // console.log(json);
    // console.log(Object.entries(json));
    // console.log(Object.entries(json).length);
    // console.log(tasksFile)
    // if (Object.entries(tasksFile).length === 0) this.writeToTasksFile(tasksFile, []);
  }

  async checkInputString(taskToAdd) {
    // check if the input separate by commas in purpose
    // to fetch all pokemons (in case input is id's)
    if (this.checkForCommas(taskToAdd.name)) return;
    // input is numbers, try to fetch pokemon and represent the data
    if (this.isValidPokemonId(taskToAdd.name)) {
      const pokemonData = await this.fetchPokemon(taskToAdd.name);
      if (!pokemonData) return;
      taskToAdd.name = `Catch ${pokemonData.name}`;
    }
    // case the input is name of pokemon then fetch the data
    if (this.allPokemons.includes(taskToAdd.name)) {
      try {
        const tryToFetchPokemon = await this.fetchPokemon(taskToAdd.name);
        if (tryToFetchPokemon) taskToAdd.name = `Catch ${taskToAdd.name}`;
      } catch {}
    }
    // check if the input already exist, if so, return
    if (await this.checkForDuplicates(taskToAdd.name)) {
      console.log(`The task: ${taskToAdd.name} already in the list`);
      return;
    }
    this.addTask(taskToAdd);
    return taskToAdd.name;
  }

  checkForCommas(str) {
    if (str.indexOf(",") > -1) {
      let nanFlag = false; // in case str is not a number
      const tokens = str.split(",");
      for (const token of tokens)
        if (!this.isValidPokemonId(token)) nanFlag = true;
      if (!nanFlag) {
        // in case all the tokens are numbers then
        // check again the string and fetching pokemons
        // if not, just post the string as is
        for (const token of tokens) this.checkInputString(token);
        return true;
      }
    }
  }

  // check if string is valid pokemon id: positive integer
  isValidPokemonId(str) {
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
  async checkForDuplicates(taskToAdd) {
    const allTasks = await this.readTasksFile(tasksFile);
    for (const task of allTasks) {
      if (task.name === taskToAdd) return true;
    }
    return false;
  }

  // fetch pokemon from API, add it to the pokemons map and post its name with "Catch"
  async fetchPokemon(pokemonId) {
    const pokemonData = await this.pokemonClient.getPokemonData(pokemonId);
    if (!pokemonData) return;
    return pokemonData;
  }

  async addTask(task) {
    const addedTask = [];
    addedTask.push(task);
    let content = await this.readTasksFile(tasksFile);
    if (!content) content = [];
    content = [...content, ...addedTask];
    await this.writeToTasksFile(tasksFile, content);
  }

  async deleteTask(task) {
    let content = await this.readTasksFile(tasksFile);
    if (!content) return;
    let index = content.findIndex(function(item, i){
      return item.name === task.name
    });
    delete content[index];
    await this.writeToTasksFile(tasksFile, content);
  }

  // fetching all the pokemons and hold it in list
  async fetchAllPokemons() {
    const fetchedPokemons = await this.pokemonClient.getAllPokemons();
    if (!fetchedPokemons) fetchedPokemons = [];
    this.allPokemons = [];
    for (const pokemon of Object.values(await fetchedPokemons)[3])
      this.allPokemons.push(pokemon.name);
  }

  async sendPokemonsMapToClient() {
    const pokemonsDataMap = new Map();
    const tasks = await this.readTasksFile(tasksFile);
    if (await tasks) {
      for (const task of tasks) {
        const tokens = task.name.split(" ");
        if (tokens[0] === "Catch") {
          const tryToFetchPokemonData = await this.fetchPokemon(tokens[1]);
          if (tryToFetchPokemonData)
            pokemonsDataMap.set(task.name, tryToFetchPokemonData);
        }
      }
    }
    const obj = Object.fromEntries(pokemonsDataMap);
    return obj;
  }

  async getAll() {
    return await this.readTasksFile(tasksFile);
  }

  async readTasksFile(file) {
    try {
      const data = await fs.readFile(file);
      return await JSON.parse(data.toString());
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
  }

  async writeToTasksFile(file, content) {
    try {
      await fs.writeFile(file, JSON.stringify(content));
    } catch (error) {
      console.error(`Failed to write to file ${error.message}`);
    }
  }
};
