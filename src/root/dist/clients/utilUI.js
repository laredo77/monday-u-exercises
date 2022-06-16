const PokemonClient = require("../../server/clients/PokemonClient");

module.exports = class utilUI {
  constructor(itemManager) {
    this.taskToAdd = document.getElementById("input");
    this.paginationElement = document.getElementById("pagination");
    this.paginationElement.innerHTML = "";
    this.currentPage = 1;
    this.createPagingBtn(this.currentPage);
    this.itemManager = itemManager;
    this.pokemonClient = new PokemonClient();
    this.allPokemons = this.fetchAllPokemons();
    // this.pokemonsDataMap = new Map();
  }

  // displaying the currect page
  displayPage(page) {
    this.currentPage = this.itemManager.getCurrentPage();
    const pageBtn = document.getElementById(this.currentPage);
    // if the current page the correct just active the page color
    if (this.currentPage == page) pageBtn.classList.add("active");
    // if not, change the items, change the right colors of the paging
    this.currentPage = page;
    this.itemManager.setCurrentPage(this.currentPage);
    const tasksInCurrentPage = this.itemManager.getItemsBelongToPage(
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
    this.itemManager.setCurrentPage(this.currentPage);
  }

  paginationButton(page) {
    const newPageButton = document.createElement("button");
    newPageButton.innerText = page;
    newPageButton.id = page;
    const self = this; // inside the function, 'this' behave like html element (button)
    if (this.itemManager.getCurrentPage() == page)
      newPageButton.classList.add("active");
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

  addTaskToHTML(task) {
    this.currentPage = this.itemManager.getCurrentPage();
    this.taskToAdd.value = ""; // clean input line
    // adding the task to the html
    document.querySelector("#tasks").innerHTML += `
            <div class="task">
                <span id="taskname" style="width:600px;">
                  ${task}
                </span>
                <button class="delete">
                  <i class="far fa-trash-alt"></i>
                </button>
            </div>
          `;
    const self = this; // inside the function, 'this' behave like html element (button)
    // and adding delete functionallty to the tasks element
    let currentTasks = document.querySelectorAll(".delete");
    for (const currentTask of currentTasks) {
      // in case clicking to remove then remove the element
      currentTask.onclick = function () {
        self.updateDataStorage(this.parentNode.innerText, x);
        this.parentNode.remove(); //remove node
        const tasksInCurrentPage = self.itemManager.getItemsBelongToPage(
          self.currentPage
        );
        // if it is the first page and no more items, just return and ready to add new
        if (self.currentPage === 1 && tasksInCurrentPage.length === 0) return;
        self.updatePages(); // if no, update the pages
      };
    }
    // adding the onclick functionallty to each task
    currentTasks = document.querySelectorAll("[id=taskname]");
    const tmpPokemonsArr = Array.from(this.itemManager.getPokemonsMap().keys());
    for (const currentTask of currentTasks) {
      currentTask.onclick = function () {
        // if the task is pokemon the display its data
        if (tmpPokemonsArr.includes(this.parentNode.innerText))
          self.popupPokemonData(this.parentNode.innerText);
        else alert(currentTask.parentNode.innerText); // otherwise alert the task
      };
    }
  }

  updateDataStorage(parentNodeInnerText, currentPage) {
    // update map & paging
    const tasksInCurrentPage =
      this.itemManager.getItemsBelongToPage(currentPage);
    let index = tasksInCurrentPage.indexOf(parentNodeInnerText);
    const tmpArr = tasksInCurrentPage;
    tmpArr.splice(index, 1);
    this.itemManager.setItemsBelongToPage(currentPage, tmpArr);
    // update chronological arrray
    const tmpChronologicalArr = this.itemManager.getChronologicalArr();
    index = tmpChronologicalArr.indexOf(parentNodeInnerText);
    tmpChronologicalArr.splice(index, 1);
    this.itemManager.setChronologicalArr(tmpChronologicalArr);
    //update pokemons map
    const tmpPokemonsMap = this.itemManager.getPokemonsMap();
    if (tmpPokemonsMap.has(parentNodeInnerText)) {
      tmpPokemonsMap.delete(parentNodeInnerText);
      this.itemManager.setPokemonsMap(tmpPokemonsMap);
    }
  }

  updatePages() {
    this.currentPage = this.itemManager.getCurrentPage();
    const items = this.itemManager.getItemsBelongToPage(this.currentPage);
    // if no more items in the current page, delete it visually
    if (items.length === 0) {
      let lastPage = this.itemManager.getLastPage();
      this.itemManager.deleteKeyFromMap(lastPage);
      document.getElementById(lastPage).remove();
      lastPage--;
      this.itemManager.setLastPage(lastPage);
      this.displayPage(lastPage);
    }
    this.itemManager.fixMapAfterUpdatePage();
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

    const pokemonsMap = this.itemManager.getPokemonsMap();
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

  async checkInputString(taskToAdd) {
    // check if the input separate by commas in purpose
    // to fetch all pokemons (in case input is id's)
    if (this.checkForCommas(taskToAdd)) return;
    // input is numbers, try to fetch pokemon and represent the data
    if (this.isValidPokemonId(taskToAdd)) {
      const pokemonName = await this.fetchPokemon(taskToAdd);
      if (!pokemonName) {
        this.clearInputLine();
        return;
      }
      taskToAdd = `Catch ${pokemonName}`;
    }
    // case the input is name of pokemon then fetch the data
    if ((await this.allPokemons).includes(taskToAdd)) {
      await this.fetchPokemon(taskToAdd);
      taskToAdd = `Catch ${taskToAdd}`;
    }
    // check if the input already exist, if so, return
    if (this.itemManager.pageToTasksMap.size)
      if (this.checkForDuplicates(taskToAdd)) return;

    this.addTask(taskToAdd);
  }

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
        for (const token of tokens) this.checkInputString(token);
        return true;
      }
    }
  }

  // check if string is valid pokemon id: positive integer
  isValidPokemonId(str) {
    if (
      !isNaN(str) &&
      parseInt(Number(str)) == str &&
      !isNaN(parseInt(str, 10)) &&
      str > 0
    )
      return true;
    return false;
  }

  // function that check if the input allready exist
  // if so, alert the page the item display in
  checkForDuplicates(taskToAdd) {
    for (const pageWithTasks of this.itemManager.pageToTasksMap) {
      if (pageWithTasks[1].includes(taskToAdd)) {
        alert(
          `The task: ${taskToAdd} already in the list, check it out at page: ${pageWithTasks[0]}`
        );
        this.clearInputLine();
        return true;
      }
    }
  }

  // fetch pokemon from API, add it to the pokemons map and post its name with "Catch"
  async fetchPokemon(pokemonId) {
    const pokemonData = await this.pokemonClient.getPokemonData(pokemonId);
    if (!pokemonData) return;
    const catchPokemonTask = "Catch " + pokemonData.name;
    this.pokemonsDataMap.set(catchPokemonTask, pokemonData);
    return pokemonData.name;
  }

  addTask(taskToAdd) {
    this.itemManager.chronologicalArr.push(taskToAdd);
    // if current page is full (5 items) cant add new item
    if (
      this.itemManager.pageToTasksMap.get(this.itemManager.currentPage)
        .length === this.itemManager.maxTasksInPage
    ) {
      // if also the last page is full, need to create new page
      if (
        this.itemManager.pageToTasksMap.get(this.itemManager.lastPage)
          .length === this.itemManager.maxTasksInPage
      ) {
        const tasks = [];
        tasks.push(taskToAdd);
        this.itemManager.lastPage++;
        this.itemManager.pageToTasksMap.set(this.itemManager.lastPage, tasks);
        this.clearInnerHTML("#tasks");
        this.createPagingBtn(this.itemManager.pageToTasksMap.size);
      } // last page is not full, adding to the end of the list
      else {
        this.itemManager.pageToTasksMap.set(this.itemManager.lastPage, [
          ...this.itemManager.pageToTasksMap.get(this.itemManager.lastPage),
          taskToAdd,
        ]);
      }
    } // current page it not full, adding the item to the end of the list
    else {
      this.itemManager.pageToTasksMap.set(this.itemManager.currentPage, [
        ...this.itemManager.pageToTasksMap.get(this.itemManager.currentPage),
        taskToAdd,
      ]);
    }
    // calling the function of displaying the last page (the page of the new item)
    this.displayPage(this.itemManager.lastPage);
  }

  // fetching all the pokemons and hold it in list
  async fetchAllPokemons() {
    const fetchedPokemons = await this.pokemonClient.getAllPokemons();
    const pokemonsNameArr = [];
    for (const pokemon of fetchedPokemons.results)
      pokemonsNameArr.push(pokemon.name);
    return pokemonsNameArr;
  }
};
