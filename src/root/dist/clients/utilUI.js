const MAX_TASKS = 35;

export class utilUI {
  constructor(itemClients, tasks) {
    this.taskToAdd = document.getElementById("input");
    this.paginationElement = document.getElementById("pagination");
    this.paginationElement.innerHTML = "";
    this.currentPage = 1;
    this.lastPage = 1;
    this.createPagingBtn(this.currentPage);
    this.tasks = tasks;
    this.initClient();
    this.itemClients = itemClients;
  }

  async initClient() {
    for (let i = 0; i < this.tasks.length; i++) {
      if (i % 5 == 0 && i > 0) {
        this.currentPage++;
        this.lastPage++;
        this.createPagingBtn(this.currentPage);
        this.displayPage(this.currentPage)
      }
      this.addTaskToHTML(this.tasks[i]);
    }
    this.pokemonsMap = await this.getPokemonsMap();
    await this.alertTasksWhenClickedWithData();
  }

  async getPokemonsMap() {
    const response = await fetch("http://localhost:8080/tasks/pokemons", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let res = await response.json();
    return res;
  }

  async addNewTaskScheme(newTask) {
    if (this.tasks.length === MAX_TASKS)
      return; // throw error max tasks length
    this.tasks.push(newTask);
    this.clearInputLine();
    if (this.tasks.length % 5 == 1 && this.tasks.length > 1) {
      this.clearInnerHTML("#tasks");
      this.createPagingBtn(Math.round(this.tasks.length / 5) + 1);
      this.currentPage++;
      this.lastPage++;
      this.displayPage(this.currentPage);
    } else {
      this.displayPage(this.lastPage);
    }
    this.addTaskToHTML(newTask);
    await this.alertTasksWhenClickedWithData();
  }

  async getItemsBelongToPage(page) {
    const tasksInPage = await this.tasks.slice();
    const res = tasksInPage.slice(
      5 * (page - 1),
      Math.min(this.tasks.length, 5 * page)
    );
    return tasksInPage.slice(
      5 * (page - 1),
      Math.min(this.tasks.length, 5 * page)
    );
  }

  // displaying the currect page
  async displayPage(page) {
    const pageBtn = document.getElementById(this.currentPage);
    // if the current page the correct just active the page color
    if (this.currentPage == page) pageBtn.classList.add("active");
    // if not, change the items, change the right colors of the paging
    this.currentPage = page;
    const tasksInCurrentPage = await this.getItemsBelongToPage(
      this.currentPage
    );
    this.clearInnerHTML("#tasks");
    if (tasksInCurrentPage)
      for (const task of tasksInCurrentPage) this.addTaskToHTML(task);
    const currentPageBtn = document.querySelector(".pagenumbers button.active");
    if (currentPageBtn) {
      currentPageBtn.classList.remove("active");
      const newPageBtn = document.getElementById(this.currentPage);
      newPageBtn.classList.add("active");
    }
  }

  paginationButton(page) {
    const newPageButton = document.createElement("button");
    newPageButton.innerText = page;
    newPageButton.id = page;
    if (this.currentPage == page) newPageButton.classList.add("active");
    const self = this; // inside the function, 'this' behave like html element (button)
    // when user clicking on the page button, it display the items belong to this page
    newPageButton.addEventListener("click", function () {
      self.displayPage(page);
      const currentPageBtn = document.querySelector(
        ".pagenumbers button.active"
      );
      currentPageBtn.classList.remove("active");
      newPageButton.classList.add("active");
    });
    return newPageButton;
  }

  clearInnerHTML(tag) {
    document.querySelector(tag).innerHTML = ``;
  }

  createPagingBtn(page) {
    const pageBtn = this.paginationButton(page);
    this.paginationElement.appendChild(pageBtn);
  }

  async addTaskToHTML(task) {
    this.taskToAdd.value = ""; // clean input line
    let taskWithoutQoutes = task.replace(/['"]+/g, '');
    // adding the task to the html
    document.querySelector("#tasks").innerHTML += `
            <div class="task">
                <span id="taskname" style="width:600px;">
                  ${taskWithoutQoutes}
                </span>
                <button class="delete">
                  <i class="far fa-trash-alt"></i>
                </button>
            </div>
          `;
    const self = this; // inside the function, 'this' behave like html element (button)
    // and adding delete functionallty to the tasks element
    const currentTasks = document.querySelectorAll(".delete");
    for (const currentTask of currentTasks) {
      // in case clicking to remove then remove the element
      currentTask.onclick = async function () {
        self.itemClients.deleteTask(this.parentNode.innerText);
        this.parentNode.remove(); //remove node
        const tasksInCurrentPage = await self.getItemsBelongToPage(
          self.currentPage
        );
        // if it is the first page and no more items, just return and ready to add new
        if (self.currentPage === 1 && tasksInCurrentPage.length === 0) return;
        self.updatePages(); // if no, update the pages
      };
    }
  }

  async alertTasksWhenClickedWithData() {
    // adding the onclick functionallty to each task
    const currentTasks = document.querySelectorAll("[id=taskname]");
    const tmpPokemonsArr = Array.from(Object.keys(this.pokemonsMap));
    const self = this; // inside the function, 'this' behave like html element (button)
    for (const currentTask of currentTasks) {
      currentTask.onclick = function () {
        // if the task is pokemon the display its data
        if (tmpPokemonsArr.includes(this.parentNode.innerText))
          self.popupPokemonData(this.parentNode.innerText);
        else alert(currentTask.parentNode.innerText); // otherwise alert the task
      };
    }
  }

  async updatePages() {
    // let currentPage = Math.round(this.tasks.length / 5);
    const items = await this.getItemsBelongToPage(this.currentPage);
    // if no more items in the current page, delete it visually
    if (items.length === 0) {
      document.getElementById(this.lastPage).remove();
      this.lastPage--;
      this.displayPage(this.lastPage);
    }
    this.displayPage(this.currentPage);
  }

  // this function manage the popup pokemons data when pokemon is pressed
  popupPokemonData(task) {
    // when pokemon is clicked, the screen is freeze and popup box with
    // the pokemon data is display
    const popupBox = document.getElementById("popup-container");
    const closeBtn = document.getElementsByClassName("popup-close-btn")[0];
    popupBox.style.display = "block";
    // clicking on close button or outside of the popup box will close the box
    closeBtn.onclick = function () {
      popupBox.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == popupBox) {
        popupBox.style.display = "none";
      }
    };

    const pokemonsMap = new Map(Object.entries(this.pokemonsMap));
    // not all pokemons have 2 types so use try & catch
    try {
      document.getElementById("updateType").innerHTML = `${
        pokemonsMap.get(task).types[0].type.name
      } / ${pokemonsMap.get(task).types[1].type.name}`;
    } catch {
      // just one type
      document.getElementById("updateType").innerHTML = `${
        pokemonsMap.get(task).types[0].type.name
      }`;
    } finally {
      // adding the rest of the attribures belong to the specific pokemon
      document
        .getElementById("updateImg")
        .setAttribute(
          "src",
          pokemonsMap.get(task).sprites.other.dream_world.front_default
        );
      document.getElementById("updateName").innerHTML =
        pokemonsMap.get(task).name;
      document.getElementById("updateWeight").innerHTML = `${
        pokemonsMap.get(task).weight / 10
      }kg`;
      document.getElementById("updateHeight").innerHTML = `${
        pokemonsMap.get(task).height / 10
      }m`;
    }
  }

  clearInputLine() {
    document.getElementById("input").value = "";
  }

  removeElement(elmId) {
    document.getElementById(elmId).remove();
  }
}
