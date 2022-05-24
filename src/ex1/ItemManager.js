import { clearInnerHTML } from "./View.js";
import { createPagingBtn } from "./View.js";
import { displayPage } from "./View.js";
import { clearInputLine } from "./View.js";
import { removeElement } from "./View.js";
import { PokemonClient } from "./PokemonClient.js";

export class ItemManager {
  constructor() {
    this.page_to_tasks_map = new Map();
    this.chronological_arr = [];
    this.page_to_tasks_map.set(1, []);
    this.current_page = 1;
    this.last_page = 1;
    this.pokemonClient = new PokemonClient();
    this.pokemons_arr = [];
  }

  async addTask(taskToAdd) {
    if(this.checkForCommas(taskToAdd)) return;
    if (this.isNumber(taskToAdd)) {
      let pokimon_name = await this.addPokimon(taskToAdd);
      taskToAdd = "Catch " + pokimon_name;
    }
    if (this.page_to_tasks_map.size) {
        if (this.checkForDuplicates(taskToAdd)) return;
    }
    this.chronological_arr.push(taskToAdd);
    if (this.page_to_tasks_map.get(this.current_page).length === 5) {
      if (this.page_to_tasks_map.get(this.last_page).length === 5) {
        let tasks = [];
        tasks.push(taskToAdd);
        this.last_page++;
        this.page_to_tasks_map.set(this.last_page, tasks);
        clearInnerHTML("#tasks");
        createPagingBtn(this.page_to_tasks_map.size);
      } else {
        this.page_to_tasks_map.set(this.last_page, [
          ...this.page_to_tasks_map.get(this.last_page),
          taskToAdd,
        ]);
      }
    } else {
      this.page_to_tasks_map.set(this.current_page, [
        ...this.page_to_tasks_map.get(this.current_page),
        taskToAdd,
      ]);
    }
    displayPage(this.last_page);
  }

  checkForDuplicates(taskToAdd) {
    for (let i = 1; i < this.page_to_tasks_map.size + 1; i++) {
        let arr_tasks = this.page_to_tasks_map.get(i);
        if (arr_tasks.includes(taskToAdd)) {
          alert("The task: " + taskToAdd + " already in the list, check it out at page: " + i);
          clearInputLine();
          return true;
        }
      }
  }

  deleteKeyFromMap(page) {
    this.page_to_tasks_map.delete(page);
  }

  getItemsBelongToPage(page) {
    return this.page_to_tasks_map.get(page);
  }

  setItemsBelongToPage(page, items) {
    this.page_to_tasks_map.set(page, items);
  }

  getLastPage() {
    return this.last_page;
  }

  setLastPage(page) {
    this.last_page = page;
  }

  getCurrentPage() {
    return this.current_page;
  }

  setCurrentPage(page) {
    this.current_page = page;
  }

  getChronologicalArr() {
    return this.chronological_arr;
  }

  setChronologicalArr(arr) {
    this.chronological_arr = arr;
  }

  fixMapAfterUpdatePage() {
    for (let i = 1; i < this.page_to_tasks_map.size; i++) {
      if (
        this.page_to_tasks_map.get(i).length < 5 &&
        i < this.page_to_tasks_map.size
      ) {
        let moved_num = this.page_to_tasks_map.get(i + 1).shift();
        this.page_to_tasks_map.set(i, [
          ...this.page_to_tasks_map.get(i),
          moved_num,
        ]);
        if (this.page_to_tasks_map.get(i + 1).length === 0) {
          this.page_to_tasks_map.delete(i + 1);
          removeElement(i + 1);
          this.last_page--;
        }
      }
    }
  }

  sortLexicographically() {
    let lexicographically_arr = [];
    for (let i = 1; i < this.page_to_tasks_map.size + 1; i++) {
      let tmp_list = this.page_to_tasks_map.get(i);
      for (let j = 0; j < tmp_list.length; j++) {
        lexicographically_arr.push(tmp_list[j]);
      }
    }
    lexicographically_arr.sort();
    this.mySort(lexicographically_arr.slice());
  }

  chronologicalSort() {
    this.mySort(this.chronological_arr.slice());
  }

  mySort(array) {
    let key = 1;
    let len = array.length;
    for (let i = 0; i < len; i++) {
      let tmp_list = [];
      if (array.length > 5) {
        for (let j = 0; j < 5; j++) {
          tmp_list.push(array.shift());
        }
        this.page_to_tasks_map.set(key, tmp_list);
        key++;
      } else {
        this.page_to_tasks_map.set(key, array);
        break;
      }
    }
    displayPage(1);
  }

  async addPokimon(pokimon_id) {
    let pokemon_data = await this.pokemonClient.getPokemonData(pokimon_id);
    this.pokemons_arr.push(pokimon_id);
    return pokemon_data.name;
  }

  isNumber(str) {
    if (!isNaN(str) && parseInt(Number(str)) == str && !isNaN(parseInt(str, 10))) return true;
    return false;
  }

  checkForCommas(str) {
    if (str.indexOf(',') > -1) {
        let nan_flag = false;
        let tokens = str.split(',');
        for (let i = 0; i < tokens.length; i++) {
            if (!this.isNumber(tokens[i])) nan_flag = true;
        }
        if (!nan_flag) {
            for (let i = 0; i < tokens.length; i++) {
                this.addTask(tokens[i]);
            } 
            return true;
        }
    }
  }
}