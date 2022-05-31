// this class manage the view of the page
export class View {
  constructor(itemManager) {
    this.itemManager = itemManager;
    this.taskToAdd = document.getElementById("input");
    this.paginationElement = document.getElementById("pagination");
    this.lastPage = 1;
    this.currentPage = 1;

    this.paginationElement.innerHTML = "";
    const pageBtn = this.paginationButton(this.currentPage);
    this.paginationElement.appendChild(pageBtn);
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
    const items = this.itemManager.getItemsBelongToPage(this.currentPage);
    this.clearInnerHTML("#tasks");
    if (items) for (const item of items) this.addTaskToHTML(item);
    const currentBtn = document.querySelector(".pagenumbers button.active");
    if (currentBtn) {
      currentBtn.classList.remove("active");
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
      const currentBtn = document.querySelector(".pagenumbers button.active");
      currentBtn.classList.remove("active");
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
    const self = this;
    // and adding delete functionallty to the tasks element
    let currentTasks = document.querySelectorAll(".delete");
    for (const currentTask of currentTasks) {
      // in case clicking to remove then remove the element
      currentTask.onclick = function () {
        self.updateDataStorage(this.parentNode.innerText, self.currentPage);
        this.parentNode.remove(); //remove node
        const items = self.itemManager.getItemsBelongToPage(self.currentPage);
        // if it is the first page and no more items, just return and ready to add new
        if (self.currentPage === 1 && items.length === 0) return;
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
        else alert(currentTasks[i].parentNode.innerText); // otherwise alert the task
      };
    }
  }

  updateDataStorage(parentNodeInnerText, currentPage) {
    // update map & paging
    const items = this.itemManager.getItemsBelongToPage(currentPage);
    let index = items.indexOf(parentNodeInnerText);
    const tmpArr = items;
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
      this.lastPage = this.itemManager.getLastPage();
      this.itemManager.deleteKeyFromMap(this.lastPage);
      document.getElementById(this.lastPage).remove();
      this.lastPage--;
      this.itemManager.setLastPage(this.lastPage);
      this.displayPage(this.lastPage);
    }
    this.itemManager.fixMapAfterUpdatePage();
    this.displayPage(this.currentPage);
  }

  // this function manage the popup pokemons data when pokemon is pressed
  popupPokemonData(task) {
    // when pokemon is clicked, the screen is freeze and popup box with
    // the pokemon data is display
    const popupBox = document.getElementById("popup-container");
    const span = document.getElementsByClassName("popup-close-btn")[0];
    popupBox.style.display = "block";
    span.onclick = function () {
      popupBox.style.display = "none";
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
}
