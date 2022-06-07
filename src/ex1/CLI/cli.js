import { Command } from "commander";
import {
  checkInputString,
  deleteTask,
  getAllTasks,
  deleteAll,
} from "./commands.js";

const todoApp = new Command();

todoApp
  .name("Laredo ToDo App")
  .description("ToDo App for daily todo's and catching pokemons")
  .version("1.0.0");

todoApp
  .command("add")
  .description("Add new task")
  .argument("<string>", "task")
  .action((taskToAdd) => {
    checkInputString(taskToAdd);
  });

todoApp
  .command("delete")
  .description("delete task")
  .argument("<string>", "task")
  .action((taskToAdd) => {
    deleteTask(taskToAdd);
  });

todoApp
  .command("deleteall")
  .description("delete all tasks")
  .action(() => {
    deleteAll();
  });

todoApp
  .command("get")
  .description("get all tasks")
  .action(() => {
    getAllTasks().then(function (result) {
      console.log(result);
    });
  });

todoApp.parse();
