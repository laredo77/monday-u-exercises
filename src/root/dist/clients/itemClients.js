// import { response } from "express";
import { utilUI } from "./utilUI.js";

export class ItemClients {
   constructor() {
    this.initClient();
  }

  async initClient() {
    const response = await fetch("http://localhost:8080/tasks/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await this.getAllTasks();
    this.utilUI = new utilUI(this, this.tasks);
  }

  // const fetchPromise = fetch('https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json');

  // fetchPromise.then( response => {
  //   const jsonPromise = response.json();
  //   jsonPromise.then( json => {
  //     console.log(json[0].name);
  //   });
  // });

  async getAllTasks() {
    this.tasks = [];
    const fetchTasks = await fetch("http://localhost:8080/tasks/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let res = await fetchTasks.json();
    for (const task in res) this.tasks.push(JSON.stringify(res[task].name));
  }

  async addNewTask(taskName) {
    const newTask = { name: taskName };
    const response = await fetch("http://localhost:8080/tasks/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    const res = await response.json();
    this.utilUI.addNewTaskScheme(res);
  }

  async deleteTask(task) {
    await fetch("http://localhost:8080/tasks/", {
      method: "DELETE",
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({name: task}),
    });
  }
}