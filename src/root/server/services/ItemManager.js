const PokemonClient = require("../clients/PokemonClient");
// const utilUI = require("../../dist/clients/utilUI");
const tasksFile = "tasks.json";
const fs = require("fs");

module.exports = class ItemManager {
  constructor() {
    this.pageToTasksMap = new Map();
    this.chronologicalArr = [];
    this.pageToTasksMap.set(1, []);
    this.currentPage = 1;
    this.lastPage = 1;
    this.pokemonClient = new PokemonClient();
    this.pokemonsDataMap = new Map();
    this.maxTasksInPage = 5;
  }

  async addTask(task) {
    const response = [];
    let data = await this.readTasksFile();
    if (!data) data = [];
    response.push(task);
    data = [...data, ...response];
    await this.writeTasksFile(data);
    return response;
  }

  deleteKeyFromMap(page) {
    this.pageToTasksMap.delete(page);
  }

  getItemsBelongToPage(page) {
    return this.pageToTasksMap.get(page);
  }

  setItemsBelongToPage(page, items) {
    this.pageToTasksMap.set(page, items);
  }

  getLastPage() {
    return this.lastPage;
  }

  setLastPage(page) {
    this.lastPage = page;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getChronologicalArr() {
    return this.chronologicalArr;
  }

  setChronologicalArr(arr) {
    this.chronologicalArr = arr;
  }

  getPokemonsMap() {
    return this.pokemonsDataMap;
  }

  setPokemonsMap(map) {
    this.pokemonsDataMap = map;
  }

  // when had deletion of item, this function update the data in the arrays
  fixMapAfterUpdatePage() {
    // 'i' represent page (start with 1)
    for (let i = 1; i < this.pageToTasksMap.size; i++) {
      // if in the current page thier is less then 5 items but also thier is more pages then
      // the current page so need to move item from the current page + 1 to the current page
      if (
        this.pageToTasksMap.get(i).length < this.maxTasksInPage &&
        i < this.pageToTasksMap.size
      ) {
        // moving and updating the map
        const movedNum = this.pageToTasksMap.get(i + 1).shift();
        this.pageToTasksMap.set(i, [...this.pageToTasksMap.get(i), movedNum]);
        // in case the last page empty from items so delete the page as well
        if (this.pageToTasksMap.get(i + 1).length === 0) {
          this.pageToTasksMap.delete(i + 1);
          // this.utilUI.removeElement(i + 1);
          this.lastPage--;
        }
      }
    }
  }

  lexicographicallySort() {
    const lexicographicallyArr = [];
    for (const pageWithItems of this.pageToTasksMap)
      lexicographicallyArr.push(...pageWithItems[1]);
    lexicographicallyArr.sort();
    this.updatePagesWithItems(lexicographicallyArr.slice());
  }

  chronologicalSort() {
    this.updatePagesWithItems(this.chronologicalArr.slice());
  }

  // function that update the data map after sorting
  // each page with its new items
  updatePagesWithItems(arrayOfTasks) {
    let page = 1;
    const len = arrayOfTasks.length;
    for (let i = 0; i < len; i++) {
      const tmpArr = [];
      if (arrayOfTasks.length > this.maxTasksInPage) {
        for (let j = 0; j < this.maxTasksInPage; j++)
          tmpArr.push(arrayOfTasks.shift());
        this.pageToTasksMap.set(page, tmpArr);
        page++;
      } else {
        this.pageToTasksMap.set(page, arrayOfTasks);
        break;
      }
    }
    // this.utilUI.displayPage(1);
  }

  deleteAll() {
    this.pageToTasksMap.clear();
    this.pageToTasksMap.set(1, []);
    this.chronologicalArr = [];
    this.pokemonsDataMap.clear();
    this.currentPage = 1;
    // for (let i = this.lastPage; i > 1; i--) this.utilUI.removeElement(i);
    this.lastPage = 1;
    // this.utilUI.clearInputLine();
    // this.utilUI.displayPage(1);
  }

  async readTasksFile() {
    try {
      const data = await fs.readFile(tasksFile);
      return await JSON.parse(data.toString());
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
  }

  async writeToTasksFile(content) {
    try {
      await fs.writeFile(tasksFile, JSON.stringify(content));
    } catch (error) {
      console.error(`Failed to write to file ${error.message}`);
    }
  }
};
