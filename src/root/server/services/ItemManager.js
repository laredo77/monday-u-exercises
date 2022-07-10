const PokemonClient = require("../clients/PokemonClient");
const tasksFile = "tasks.txt";
const fs = require("fs");
const readline = require("readline");

module.exports = class ItemManager {
  constructor() {
    this.pokemonClient = new PokemonClient();
    this.fetchAllPokemons();
    this.tasks = [];
    this.writeStream = fs.createWriteStream(tasksFile, { flags: "a" });
    this.readStream = fs.createReadStream(tasksFile);
  }

  async initClient() {
    // get all tasks from the db
    this.tasks = await this.readTasksFile();
  }

  async addNewTaskScheme(task) {
    // input is numbers, try to fetch pokemon and represent the data
    if (this.isValidPokemonId(task)) {
      const pokemonData = await this.fetchPokemon(task);
      if (!pokemonData) return null;
      task = `Catch ${pokemonData.name}`;
    }
    // case the input is name of pokemon then fetch the data
    if (this.allPokemons.includes(task)) {
      try {
        const tryToFetchPokemon = await this.fetchPokemon(task);
        if (tryToFetchPokemon) task = `Catch ${task}`;
      } catch {}
    }
    // check if the input already exist, if so, return
    if (await this.checkForDuplicates(task)) {
      console.log(`The task: ${task} already in the list`);
      return null;
    }
    await this.addTask(task);
    return task;
  }

  async checkInputString(taskToAdd) {
    // check if the input separate by commas in purpose
    // to fetch all pokemons (in case input is id's)
    const res = this.checkForCommas(taskToAdd.name);
    if (!res) return;
    const tasksName = [];
    if (Array.isArray(res)) {
      for (const task of res) {
        const retVal = await this.addNewTaskScheme(task);
        tasksName.push(retVal);
      }
    } else {
      const retVal = await this.addNewTaskScheme(res);
      tasksName.push(retVal);
    }
    return tasksName;
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
        return tokens;
      }
    }
    return str;
  }

  // check if string is valid pokemon id: positive integer
  isValidPokemonId(str) {
    if (
      !isNaN(str) &&
      parseInt(Number(str)) == str &&
      !isNaN(parseInt(str, 10)) &&
      str > 0 &&
      str < 900
    )
      return true;
    return false;
  }

  // function that check if the input allready exist
  // if so, alert the page the item display in
  async checkForDuplicates(taskToAdd) {
    if (this.tasks.length > 0) {
      for (const task of this.tasks) {
        if (task === taskToAdd) return true;
      }
      return false;
    }
  }

  // fetch pokemon from API, add it to the pokemons map and post its name with "Catch"
  async fetchPokemon(pokemonId) {
    const pokemonData = await this.pokemonClient.getPokemonData(pokemonId);
    if (await pokemonData) return pokemonData;
  }

  async addTask(task) {
    this.tasks = [...this.tasks, task];
    await this.writeToTasksFile(task);
  }

  async deleteTask(task) {
    if (this.tasks.length == 0) return;
    let index = this.tasks.findIndex(function (item, i) {
      return item === task.name;
    });
    delete this.tasks[index];
    this.tasks = this.tasks.filter(function (elem) {
      return elem != null;
    });

    fs.readFile(tasksFile, "utf8", function (error, data) {
      if (error)
        console.error(`Got an error trying to read the file: ${error.message}`);
      let content = data.split("\n");
      content.splice(index + 1, 1).join("\n");
      fs.writeFile(tasksFile, content.join("\n"), function (error, data) {
        if (error) console.error(`Failed to write to file ${error.message}`);
      });
    });
    return task;
  }

  // fetching all the pokemons and hold it in list
  async fetchAllPokemons() {
    const fetchedPokemons = await this.pokemonClient.getAllPokemons();
    if (!fetchedPokemons) fetchedPokemons = [];
    this.allPokemons = [];
    for (const pokemon of Object.values(await fetchedPokemons)[3])
      this.allPokemons.push(pokemon.name);
  }

  // get all tasks from the db
  async getAll() {
    return this.tasks;
  }

  // delete all tasks from the db
  async deleteAllTasks() {
    fs.writeFile(tasksFile, "", (error) => {
      if (error) throw error;
    });
  }

  async readTasksFile() {
    try {
      const content = readline.createInterface({
        input: this.readStream,
        crlfDelay: Infinity,
      });
      const contentArray = [];
      for await (const line of content) contentArray.push(line);
      return contentArray;
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
  }

  async writeToTasksFile(content) {
    try {
      const writeLine = (line) => this.writeStream.write(`\n${line}`);
      writeLine(content.toString());
    } catch (error) {
      console.error(`Failed to write to file ${error.message}`);
    }
  }
};
