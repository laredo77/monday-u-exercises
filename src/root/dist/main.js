const ItemManager = require('../server/services/ItemManager')
const ItemClients = require('./clients/itemClients')

// import { ItemManager } from '../server/services/ItemManager.js';
// import { ItemClients } from './clients/itemClients.js';

class Main {
  constructor() {
    this.addBtn = document.getElementById("addTask");
    this.taskToAdd = document.getElementById("input");
    this.paginationElement = document.getElementById("pagination");
    this.lexiSortBtn = document.getElementById("lexiSort");
    this.chronoSortBtn = document.getElementById("chronoSort");
    this.deleteAllBtn = document.getElementById("deleteAll");
    this.currentPage = 1;
    this.itemManager = new ItemManager();
    this.itemClient = new ItemClients(this.itemManager);
    this.maxTasks = 35;
  }

  // add event listeners to the buttons of the app
  init() {
    this.addBtn.addEventListener("click", ({ target }) => {
      // if input is white spaces the return
      if (this.taskToAdd.value.trim().length === 0) {
        alert("Undefined input");
        this.taskToAdd.value = "";
      } // if the app has maximum of tasks (35) alert and dont add until deletion
      else if (this.itemManager.getChronologicalArr().length === this.maxTasks)
        alert("ToDo list is full (35 Items)");
      else this.itemClient.addNewTask(this.taskToAdd.value);
    });

    // if the user press "Enter" the task will add as well
    this.taskToAdd.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addTask").click();
      }
    });

    this.lexiSortBtn.addEventListener("click", ({ target }) => {
      // if the list is empty, cannot sort and alert
      if (this.itemManager.getItemsBelongToPage(1).length === 0)
        alert("Cannot sort an empty tasks list");
      else this.itemManager.lexicographicallySort();
    });

    this.chronoSortBtn.addEventListener("click", ({ target }) => {
      // if the list is empty, cannot sort and alert
      if (this.itemManager.getItemsBelongToPage(1).length === 0)
        alert("Cannot sort an empty tasks list");
      else this.itemManager.chronologicalSort();
    });

    // deleting all todo's
    this.deleteAllBtn.addEventListener("click", ({ target }) => {
      // if the list is empty, cannot delete and alert
      if (this.itemManager.getItemsBelongToPage(1).length === 0)
        alert("Cannot delete an empty tasks list");
      else this.itemManager.deleteAll();
    });
  }
}
const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  // wait until the dom content is fully loaded and then start the functionallty
  main.init();
});
