import { ItemClients } from "./clients/itemClients.js";

class Main {
  constructor() {
    this.addBtn = document.getElementById("addTask");
    this.taskToAdd = document.getElementById("input");
    this.paginationElement = document.getElementById("pagination");
    this.deleteAllBtn = document.getElementById("deleteAll");
    this.currentPage = 1;
    this.itemClient = new ItemClients();
    this.maxTasks = 35;
    this.taskCounter = 0;
  }

  // add event listeners to the buttons of the app
  async init() {
    this.addBtn.addEventListener("click", async ({ target }) => {
      // if input is white spaces the return
      if (this.taskToAdd.value.trim().length === 0) {
        alert("Undefined input");
        this.taskToAdd.value = "";
      } // if the app has maximum of tasks (35) alert and dont add until deletion
      else if (this.taskCounter === this.maxTasks)
        alert("ToDo list is full (35 Items)");
      else {
        await this.itemClient.addNewTask(this.taskToAdd.value);
        this.taskCounter++;
      }
    });

    // if the user press "Enter" the task will add as well
    this.taskToAdd.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("addTask").click();
      }
    });

    // deleting all todo's
    this.deleteAllBtn.addEventListener("click", ({ target }) => {
      // if the list is empty, cannot delete and alert
      if (this.taskCounter.length === 0)
        alert("Cannot delete an empty tasks list");
      else {
        this.itemClient.deleteAllTasks();
        this.taskCounter = 0;
      }
    });
  }
}
const main = new Main();

document.addEventListener("DOMContentLoaded", function () {
  // wait until the dom content is fully loaded and then start the functionallty
  main.init();
});
