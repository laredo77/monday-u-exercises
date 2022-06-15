import { PokemonClient } from "../clients/PokemonClient.js";
import { View } from "../../dist/View.js";

export class ItemManager {
  constructor() {
    this.pageToTasksMap = new Map();
    this.chronologicalArr = [];
    this.pageToTasksMap.set(1, []);
    this.currentPage = 1;
    this.lastPage = 1;
    this.pokemonClient = new PokemonClient();
    this.pokemonsDataMap = new Map();
    this.view = new View(this);
    this.allPokemons = this.fetchAllPokemons();
    this.maxTasksInPage = 5;
  }

  async checkInputString(taskToAdd) {
    // check if the input separate by commas in purpose
    // to fetch all pokemons (in case input is id's)
    if (this.checkForCommas(taskToAdd)) return;
    // input is numbers, try to fetch pokemon and represent the data
    if (this.isValidPokemonId(taskToAdd)) {
      const pokemonName = await this.fetchPokemon(taskToAdd);
      if (!pokemonName) {
        this.view.clearInputLine();
        return;
      }
      taskToAdd = `Catch ${pokemonName}`;
    }
    // case the input is name of pokemon then fetch the data
    if ((await this.allPokemons).includes(taskToAdd)) {
      await this.fetchPokemon(taskToAdd);
      taskToAdd = `Catch ${taskToAdd}`;
    }
    // check if the input already exist, if so, return
    if (this.pageToTasksMap.size)
      if (this.checkForDuplicates(taskToAdd)) return;

    this.addTask(taskToAdd);
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
  checkForDuplicates(taskToAdd) {
    for (const pageWithTasks of this.pageToTasksMap) {
      if (pageWithTasks[1].includes(taskToAdd)) {
        alert(
          `The task: ${taskToAdd} already in the list, check it out at page: ${pageWithTasks[0]}`
        );
        this.view.clearInputLine();
        return true;
      }
    }
  }

  // fetch pokemon from API, add it to the pokemons map and post its name with "Catch"
  async fetchPokemon(pokemonId) {
    const pokemonData = await this.pokemonClient.getPokemonData(pokemonId);
    if (!pokemonData) return;
    const catchPokemonTask = "Catch " + pokemonData.name;
    this.pokemonsDataMap.set(catchPokemonTask, pokemonData);
    return pokemonData.name;
  }

  addTask(taskToAdd) {
    this.chronologicalArr.push(taskToAdd);
    // if current page is full (5 items) cant add new item
    if (
      this.pageToTasksMap.get(this.currentPage).length === this.maxTasksInPage
    ) {
      // if also the last page is full, need to create new page
      if (
        this.pageToTasksMap.get(this.lastPage).length === this.maxTasksInPage
      ) {
        const tasks = [];
        tasks.push(taskToAdd);
        this.lastPage++;
        this.pageToTasksMap.set(this.lastPage, tasks);
        this.view.clearInnerHTML("#tasks");
        this.view.createPagingBtn(this.pageToTasksMap.size);
      } // last page is not full, adding to the end of the list
      else {
        this.pageToTasksMap.set(this.lastPage, [
          ...this.pageToTasksMap.get(this.lastPage),
          taskToAdd,
        ]);
      }
    } // current page it not full, adding the item to the end of the list
    else {
      this.pageToTasksMap.set(this.currentPage, [
        ...this.pageToTasksMap.get(this.currentPage),
        taskToAdd,
      ]);
    }
    // calling the function of displaying the last page (the page of the new item)
    this.view.displayPage(this.lastPage);
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
          this.view.removeElement(i + 1);
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
    this.view.displayPage(1);
  }

  deleteAll() {
    this.pageToTasksMap.clear();
    this.pageToTasksMap.set(1, []);
    this.chronologicalArr = [];
    this.pokemonsDataMap.clear();
    this.currentPage = 1;
    for (let i = this.lastPage; i > 1; i--) this.view.removeElement(i);
    this.lastPage = 1;
    this.view.clearInputLine();
    this.view.displayPage(1);
  }

  // fetching all the pokemons and hold it in list
  async fetchAllPokemons() {
    const fetchedPokemons = await this.pokemonClient.getAllPokemons();
    const pokemonsNameArr = [];
    for (const pokemon of fetchedPokemons.results)
      pokemonsNameArr.push(pokemon.name);
    return pokemonsNameArr;
  }
}
