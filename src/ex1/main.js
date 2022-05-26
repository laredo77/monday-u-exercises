import { ItemManager } from "./ItemManager.js";

class Main {
  constructor() {
    this.addBtn = document.getElementById("push");
    this.taskToAdd = document.getElementById("input");
    this.paginationElement = document.getElementById("pagination");
    this.lexiSortBtn = document.getElementById("lexiSort");
    this.chronoSortBtn = document.getElementById("chronoSort");
    this.deleteAllBtn = document.getElementById("deleteAll");
    this.currentPage = 1;
    this.itemManager = new ItemManager();
  }

  // add event listeners to the buttons of the app
  init() {
    this.addBtn.addEventListener("click", ({ target }) => {
      // if input is white spaces the return
      if (this.taskToAdd.value.trim().length === 0) {
        alert("Undefined input");
        this.taskToAdd.value = "";
      } // if the app has maximum of tasks (35) alert and dont add until deletion
      else if (this.itemManager.getChronologicalArr().length === 35) {
        alert("ToDo list is full (35 Items)");
      } else {
        this.itemManager.checkInputString(this.taskToAdd.value);
      }
    });

    // if the user press keypress the task will add as well
    this.taskToAdd.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("push").click();
      }
    });

    this.lexiSortBtn.addEventListener("click", ({ target }) => {
      // if the list is empty, cannot sort and alert
      if (this.itemManager.getItemsBelongToPage(1).length === 0)
        alert("first add todo's");
      else this.itemManager.lexicographicallySort();
    });

    this.chronoSortBtn.addEventListener("click", ({ target }) => {
      // if the list is empty, cannot sort and alert
      if (this.itemManager.getItemsBelongToPage(1).length === 0)
        alert("first add todo's");
      else this.itemManager.chronologicalSort();
    });

    // deleting all todo's
    this.deleteAllBtn.addEventListener("click", ({ target }) => {
      // if the list is empty, cannot delete and alert
      if (this.itemManager.getItemsBelongToPage(1).length === 0)
        alert("first add todo's");
      else this.itemManager.deleteAll();
    });
  }
}
const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  // wait until the dom content is fully loaded and then start the functionallty
  main.init();
});
