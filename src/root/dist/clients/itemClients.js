import { utilUI } from "./utilUI.js";

export class ItemClients {
  constructor() {
    this.initClient();
  }

  async initClient() {
    await fetch("http://localhost:8080/tasks/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
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
    let res = await fetchTasks.json();
    for (const task in res) this.tasks.push(JSON.stringify(res[task]));
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
    const res = await response.json();
    if ((await res[0]) == null) {
      alert("couldn`t add the task!");
      this.utilUI.clearInputLine();
      return;
    }
    if (await res) {
      await this.utilUI.addNewTaskScheme(res);
    }
  }

  async deleteTask(task) {
    await fetch("http://localhost:8080/tasks/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: task }),
    });
  }

  async deleteAllTasks() {
    await fetch("http://localhost:8080/tasks/all", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await this.utilUI.deleteAllTasks();
  }
}
