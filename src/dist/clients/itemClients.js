import { utilUI } from "./utilUI.js";

export class ItemClients {
  constructor() {
    this.initClient();
  }

  async initClient() {
    await this.getAllTasks();
    this.utilUI = new utilUI(this, this.tasks);
  }

  async getAllTasks() {
    this.tasks = [];
    const fetchTasks = await fetch("http://localhost:8080/tasks/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let resultFromServer = await fetchTasks.json();
    if ((await resultFromServer.status) == false) {
      console.log(resultFromServer.code);
      return;
    } else {
      console.log(resultFromServer.code);
      for (const task in resultFromServer.task)
        this.tasks.push(resultFromServer.task[task]);
    }
  }

  async addNewTask(taskName) {
    const newTask = { name: taskName };
    const response = await fetch("http://localhost:8080/tasks/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(newTask),
    });
    const resultFromServer = await response.json();
    if ((await resultFromServer.status) == false) {
      console.log(resultFromServer.code);
      this.utilUI.clearInputLine();
    } else {
      console.log(resultFromServer.code);
      await this.utilUI.addNewTaskScheme(resultFromServer.task);
    }
  }

  async deleteTask(task) {
    const response = await fetch("http://localhost:8080/tasks/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: task }),
    });
    const resultFromServer = await response.json();
    if ((await resultFromServer.status) == false) {
      console.log(resultFromServer.code);
    } else {
      console.log(resultFromServer.code);
    }
  }

  async deleteAllTasks() {
    const response = await fetch("http://localhost:8080/tasks/all", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const resultFromServer = await response.json();
    if ((await resultFromServer.status) == false) {
      console.log(resultFromServer.code);
    } else {
      console.log(resultFromServer.code);
      await this.utilUI.deleteAllTasks();
    }
  }
}
