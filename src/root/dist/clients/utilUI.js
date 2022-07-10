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
    // initialize fetch all the data of the privious tasks and render it
    for (let i = 0; i < this.tasks.length; i++) {
      if (i % 5 == 0 && i > 0) {
        this.currentPage++;
        this.lastPage++;
        this.createPagingBtn(this.currentPage);
      }
    }
    await this.displayPage(this.lastPage);
  }

  async getPokemons() {
    const pokemonsArray = [];
    for (const task of this.tasks) {
      let taskWithoutQoutes = task.replace(/['"]+/g, "");
      const tokens = taskWithoutQoutes.split(" ");
      if (tokens[0] === "Catch") pokemonsArray.push(taskWithoutQoutes);
    }
    return pokemonsArray;
  }

  async addTask(task) {
    if (this.tasks.length === MAX_TASKS) {
      // maximum tasks amount is 35
      alert("couldn`t add new task! the limit of tasks is 35");
      return;
    }
    // adding the tasks to the html, initialize new page if needed and display it.
    this.tasks.push(task);
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
  }

  // check if the input was a commas separated string
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
        return tokens;
      }
    }
    return str;
  }

  // check if string is valid pokemon id: positive integer
  isValidPokemonId(str) {
    if (
      !isNaN(str) &&
      parseInt(Number(str)) == str &&
      !isNaN(parseInt(str, 10)) &&
      str > 0 &&
      str < 900
    )
      return true;
    return false;
  }

  // here start the scheme of adding new task
  async addNewTaskScheme(newTask) {
    const tasks = this.checkForCommas(newTask);
    for (const task of tasks) await this.addTask(task);
  }

  // this function calculate the items in page and return it.
  // each page have 5 items so it calculate the amount of tasks and
  // with the page number and return the belong tasks.
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
    // adding the tasks to the HTML
    if (tasksInCurrentPage)
      for (const task of tasksInCurrentPage) this.addTaskToHTML(task);
    const currentPageBtn = document.querySelector(".pagenumbers button.active");
    // active the correct page btn
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
    let taskWithoutQoutes = task.replace(/['"]+/g, "");
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
        const node = this.parentNode;
        await self.itemClients.deleteTask(node.innerText);
        // find the removed task in this.tasks array
        let index = self.tasks.findIndex(function (item, i) {
          let itemWithoutQoutes = item.replace(/['"]+/g, "");
          return itemWithoutQoutes == node.innerText;
        });
        delete self.tasks[index]; // and delete it from the array
        // remove the empty spot from this.tasks array
        self.tasks = self.tasks.filter(function (elem) {
          return elem != null;
        });
        const tasksInCurrentPage = await self.getItemsBelongToPage(
          self.currentPage
        );
        this.parentNode.remove(); //remove node
        // if it is the first page and no more items, just return and ready to add new
        if (self.currentPage === 1 && tasksInCurrentPage.length === 0) return;
        await self.updatePages(); // if no, update the pages
      };
    }
    await this.alertTasksWhenClickedWithData();
  }

  // adding the functionallity when clicking on task.
  // if the task is pokemon its pop up the data of the pokemon
  // otherwise its alert the task
  async alertTasksWhenClickedWithData() {
    const currentTasks = document.querySelectorAll("[id=taskname]");
    const tmpPokemonsArr = await this.getPokemons();
    const self = this; // inside the function, 'this' behave like html element (button)
    for (const currentTask of currentTasks) {
      if (currentTask.getAttribute("listener") !== "true") {
        currentTask.addEventListener("click", async function (e) {
          // if the task is pokemon then display its data
          const elementClicked = e.target;
          elementClicked.setAttribute("listener", "true");
          if (tmpPokemonsArr.includes(currentTask.innerText)) {
            await self.popupPokemonData(currentTask.innerText);
          } else alert(currentTask.parentNode.innerText); // otherwise alert the task
        });
      }
    }
  }

  // fixing tasks to page after deletion / updating
  async updatePages() {
    const items = await this.getItemsBelongToPage(this.currentPage);
    const lastPageItems = await this.getItemsBelongToPage(this.lastPage);
    // if no more items in the current page, delete it visually
    if (items.length === 0 || lastPageItems.length === 0) {
      document.getElementById(this.lastPage).remove();
      this.lastPage--;
      this.displayPage(this.lastPage);
    }
    this.displayPage(this.currentPage);
  }

  // delete all pages and display the first page without any task
  async deleteAllTasks() {
    for (let i = this.lastPage; i > 0; i--) document.getElementById(i).remove();
    this.tasks = [];
    this.currentPage = this.lastPage = 1;
    this.createPagingBtn(this.currentPage);
    this.displayPage(this.currentPage);
  }

  async fetchPokemon(pokemonId) {
    const pokemonData = await fetch("http://localhost:8080/tasks/pokemon", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ pokemonId }),
    });
    let res = await pokemonData.json();
    return res;
  }

  // this function manage the popup pokemons data when pokemon is pressed
  async popupPokemonData(task) {
    const tokens = task.split(" ");
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
    const pokemonData = await this.fetchPokemon(tokens[1]);
    // not all pokemons have 2 types so use try & catch
    try {
      document.getElementById(
        "updateType"
      ).innerHTML = `${pokemonData.types[0].type.name} / ${pokemonData.types[1].type.name}`;
    } catch {
      // just one type
      document.getElementById(
        "updateType"
      ).innerHTML = `${pokemonData.types[0].type.name}`;
    } finally {
      // adding the rest of the attribures belong to the specific pokemon
      document
        .getElementById("updateImg")
        .setAttribute(
          "src",
          pokemonData.sprites.other.dream_world.front_default
        );
      document.getElementById("updateName").innerHTML = pokemonData.name;
      document.getElementById("updateWeight").innerHTML = `${
        pokemonData.weight / 10
      }kg`;
      document.getElementById("updateHeight").innerHTML = `${
        pokemonData.height / 10
      }m`;
    }
  }

  clearInputLine() {
    document.getElementById("input").value = "";
  }
}
