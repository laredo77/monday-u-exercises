const PokemonClient = require("../clients/PokemonClient");
const { Item } = require("../db/models");

module.exports = class ItemManager {
  constructor() {
    this.pokemonClient = new PokemonClient();
    this.fetchAllPokemons();
  }

  async addNewTaskScheme(task) {
    // input is numbers, try to fetch pokemon and represent the data OR
    // case the input is name of pokemon then fetch the data
    let newTask = { name: task, pokemonId: null };
    if (this.isValidPokemonId(task) || this.allPokemons.includes(task)) {
      try {
        const pokemonData = await this.fetchPokemon(task);
        if (pokemonData) {
          newTask = {
            name: `Catch ${pokemonData.name}`,
            pokemonId: pokemonData.id,
          };
        }
      } catch (error) {
        console.log(
          `Got an error while trying to fetch pokemon: ${error.message}`
        );
      }
    }
    // check if the input already exist, if so, return
    if (await this.checkForDuplicates(newTask.name)) {
      console.log(`The task: ${newTask.name} already in the list`);
      return null;
    }
    await this.addTaskToDB(newTask);
    return newTask.name;
  }

  async addTaskToDB(task) {
    try {
      await Item.create({
        ItemName: task.name,
        PokemonId: task.pokemonId,
        status: false,
      });
    } catch (error) {
      console.log(`couldn't write to the DB: ${error.message}`);
    }
  }

  async checkInputString(taskToAdd) {
    // check if the input separate by commas in purpose
    // to fetch all pokemons (in case input is id's)
    const res = this.checkForCommas(taskToAdd.name);
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
    if (tasksName[0] === null && tasksName.length == 1) {
      return {
        task: tasksName,
        status: false,
        code: `The item: {${taskToAdd.name}}, already in the list. cannot add duplicate items`,
      };
    }
    if (tasksName.includes(null)) {
      if (tasksName.every((element) => element === null)) {
        return {
          task: tasksName,
          status: false,
          code: `All of the items: {${taskToAdd.name}} already in the list. cannot add duplicate tasks`,
        };
      } else {
        const nullIndexs = [];
        for (let i = 0; i < tasksName.length; i++) {
          if (tasksName[i] === null) nullIndexs.push(i);
        }
        const nonNullItems = tasksName.filter(function (item) {
          return item != null;
        });
        const items = taskToAdd.name.split(",");
        const nullItems = [];
        for (const index of nullIndexs) nullItems.push(items[index]);
        return {
          task: nonNullItems,
          status: true,
          code: `The tasks: {${nullItems}} already in the list. cannot add duplicate tasks; The items: {${nonNullItems}} added to the Todo list`,
        };
      }
    }
    return {
      task: tasksName,
      status: true,
      code: `The tasks: ${tasksName}, added to the Todo list`,
    };
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
    const task = await Item.findOne({
      where: { ItemName: taskToAdd },
      raw: true,
    });
    if (task) return true;
    return false;
  }

  // fetch pokemon from API, add it to the pokemons map and post its name with "Catch"
  async fetchPokemon(pokemonId) {
    const pokemonData = await this.pokemonClient.getPokemonData(pokemonId);
    if (await pokemonData) return pokemonData;
  }

  async deleteTask(task) {
    try {
      await Item.destroy({ where: { ItemName: task.name } });
      return {
        status: true,
        code: `The task: ${task.name} successfully removed`,
      };
    } catch (error) {
      console.log(
        `couldn't remove the task ${task.name} from the DB: ${error.message}`
      );
      return {
        status: false,
        code: `couldn't remove the task ${task.name} from the DB: ${error.message}`,
      };
    }
  }

  // fetching all the pokemons and store it in list
  async fetchAllPokemons() {
    const fetchedPokemons = await this.pokemonClient.getAllPokemons();
    if (!fetchedPokemons) fetchedPokemons = [];
    this.allPokemons = [];
    for (const pokemon of Object.values(await fetchedPokemons)[3])
      this.allPokemons.push(pokemon.name);
  }

  // get all tasks from the db
  async getAll() {
    try {
      const tasks = await Item.findAll({ raw: true });
      //const tasks = [];
      //for (const task of tasksObjects) tasks.push(task);
      return {
        task: tasks,
        status: true,
        code: `feching all tasks from the list successfully`,
      };
    } catch (error) {
      console.log(`Got an error trying to fetch from DB: ${error.message}`);
      return {
        task: null,
        status: false,
        code: `Got an error trying to fetch from DB`,
      };
    }
  }

  // delete all tasks from the db
  async deleteAllTasks() {
    try {
      await Item.destroy({ where: {}, truncate: true });
      return {
        status: true,
        code: `All tasks successfully removed`,
      };
    } catch (error) {
      console.log(
        `Got an error trying to remove all tasks from DB: ${error.message}`
      );
      return {
        status: false,
        code: `Got an error trying to remove all tasks from DB: ${error.message}`,
      };
    }
  }

  async changeStatus(task) {
    try {
      await Item.update(
        { status: task.status },
        { where: { ItemName: task.task } }
      );
      return {
        status: true,
        code: `The status of ${task.task} changed successfully to ${task.status}`,
      };
    } catch (error) {
      return {
        status: false,
        code: `couldn't change the status of the task: ${error.message}`,
      };
    }
  }

  async getTaskStatus(task) {
    const item = await Item.findOne({
      where: { ItemName: task.task },
      raw: true,
    });
    return item.status;
  }
};
