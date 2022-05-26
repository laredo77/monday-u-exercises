// this class manage the view of the page
export class View {
  constructor(itemManager) {
    this.itemManager = itemManager;
    this.taskToAdd = document.getElementById("input");
    this.paginationElement = document.getElementById("pagination");
    this.lastPage = 1;
    this.currentPage = 1;

    this.paginationElement.innerHTML = "";
    const btn = this.paginationButton(this.currentPage);
    this.paginationElement.appendChild(btn);
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
    const elements = this.itemManager.getItemsBelongToPage(this.currentPage);
    this.clearInnerHTML("#tasks");
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        this.addTaskToHTML(elements[i]);
      }
    }
    const currentBtn = document.querySelector(".pagenumbers button.active");
    if (currentBtn) {
      currentBtn.classList.remove("active");
      const newPageBtn = document.getElementById(this.currentPage);
      newPageBtn.classList.add("active");
    }
    this.itemManager.setCurrentPage(this.currentPage);
  }

  paginationButton(page) {
    const button = document.createElement("button");
    button.innerText = page;
    button.id = page;
    const self = this; // inside the function, 'this' behave like html element (button)
    if (this.itemManager.getCurrentPage() == page)
      button.classList.add("active");
    // when user clicking on the page button, it display the items belong to this page
    button.addEventListener("click", function () {
      self.displayPage(page);
      const currentBtn = document.querySelector(".pagenumbers button.active");
      currentBtn.classList.remove("active");
      button.classList.add("active");
    });
    return button;
  }

  clearInnerHTML(tag) {
    document.querySelector(tag).innerHTML = ``;
  }

  createPagingBtn(page) {
    const btn = this.paginationButton(page);
    this.paginationElement.appendChild(btn);
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
    for (var i = 0; i < currentTasks.length; i++) {
      // in case clicking to remove then remove the element
      currentTasks[i].onclick = function () {
        self.updateDataStorage(this.parentNode.innerText, self.currentPage);
        //remove node
        this.parentNode.remove();
        const elements = self.itemManager.getItemsBelongToPage(
          self.currentPage
        );
        // if it is the first page and no more items, just return and ready to add new
        if (self.currentPage === 1 && elements.length === 0) return;
        // if no, update the pages
        self.updatePages();
      };
    }
    // adding the onclick functionallty to each task
    currentTasks = document.querySelectorAll("[id=taskname]");
    const tmpPokemonsArr = Array.from(this.itemManager.getPokemonsMap().keys());
    for (let i = 0; i < currentTasks.length; i++) {
      currentTasks[i].onclick = function () {
        // if the task is pokemon the display its data
        if (tmpPokemonsArr.includes(this.parentNode.innerText)) {
          self.popupPokemonData(this.parentNode.innerText);
        } // otherwise alert the task
        else {
          alert(currentTasks[i].parentNode.innerText);
        }
      };
    }
  }

  updateDataStorage(parentNodeInnerText, currentPage) {
    // update map & paging
    const elements = this.itemManager.getItemsBelongToPage(currentPage);
    let index = elements.indexOf(parentNodeInnerText);
    const tmpArr = elements;
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
    const elements = this.itemManager.getItemsBelongToPage(this.currentPage);
    // if no more items in the current page, delete it visually
    if (elements.length === 0) {
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
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function () {
      modal.style.display = "none";
    };
    let pokemonsMap = this.itemManager.getPokemonsMap();
    // not all pokemons have 2 types so use try & catch
    try {
      document.getElementById("update_type").innerHTML = `${
        pokemonsMap.get(task).types[0].type.name
      } / ${pokemonsMap.get(task).types[1].type.name}`;
    } catch {
      // just one type
      document.getElementById("update_type").innerHTML = `${
        pokemonsMap.get(task).types[0].type.name
      }`;
    } finally {
      // adding the rest of the attribures belong to the specific pokemon
      document
        .getElementById("update_img")
        .setAttribute(
          "src",
          pokemonsMap.get(task).sprites.other.dream_world.front_default
        );
      document.getElementById("update_name").innerHTML =
        pokemonsMap.get(task).name;
      document.getElementById("update_weight").innerHTML = `${
        pokemonsMap.get(task).weight / 10
      }kg`;
      document.getElementById("update_height").innerHTML = `${
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
