import { ItemManager } from "./ItemManager.js";

let itemManager = new ItemManager();
let last_page = 1;
let current_page = 1;

const addBtn = document.getElementById("push");
const taskToAdd = document.getElementById("input");
const pagination_element = document.getElementById("pagination");
const lexiSortBtn = document.getElementById("lexiSort");
const chronoSortBtn = document.getElementById("chronoSort");

pagination_element.innerHTML = "";
let btn = paginationButton(current_page);
pagination_element.appendChild(btn);

addBtn.addEventListener("click", ({ target }) => {
  if (taskToAdd.value.trim().length === 0) {
    alert("Undefined input");
    taskToAdd.value = "";
  } else if(itemManager.getChronologicalArr().length === 35) {
    alert("ToDo list is full (35 Items)")
  } else {
    itemManager.addTask(taskToAdd.value);
  }
});

taskToAdd.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("push").click();
  }
});

lexiSortBtn.addEventListener("click", ({ target }) => {
  if (itemManager.getItemsBelongToPage(1).length === 0) alert("first add todo's");
  else itemManager.sortLexicographically();
});

chronoSortBtn.addEventListener("click", ({ target }) => {
  if (itemManager.getItemsBelongToPage(1).length === 0) alert("first add todo's");
  else itemManager.chronologicalSort();
});

export function displayPage(page) {
  current_page = itemManager.getCurrentPage();
  let page_btn = document.getElementById(current_page);
  if (current_page == page) page_btn.classList.add("active");
  current_page = page;
  itemManager.setCurrentPage(current_page);
  let elements = itemManager.getItemsBelongToPage(current_page);
  clearInnerHTML("#tasks");
  for (let i = 0; i < elements.length; i++) {
    addTaskToHTML(elements[i]);
  }
  let current_btn = document.querySelector(".pagenumbers button.active");
  if (current_btn) {
    current_btn.classList.remove("active");
    let new_page_btn = document.getElementById(current_page);
    new_page_btn.classList.add("active");
  }
  itemManager.setCurrentPage(current_page);
}

function paginationButton(page) {
  let button = document.createElement("button");
  button.innerText = page;
  button.id = page;

  if (itemManager.getCurrentPage() == page) button.classList.add("active");

  button.addEventListener("click", function () {
    displayPage(page);
    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");
    button.classList.add("active");
  });
  return button;
}

export function clearInnerHTML(tag) {
  document.querySelector(tag).innerHTML = ``;
}

export function createPagingBtn(page) {
  let btn = paginationButton(page);
  pagination_element.appendChild(btn);
}

function addTaskToHTML(task) {
  current_page = itemManager.getCurrentPage();
  taskToAdd.value = "";
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
  let current_tasks = document.querySelectorAll(".delete");
  for (var i = 0; i < current_tasks.length; i++) {
    current_tasks[i].onclick = function () {
      let elements = itemManager.getItemsBelongToPage(current_page);
      let index = elements.indexOf(this.parentNode.innerText);
      let tmp_arr = elements;
      tmp_arr.splice(index, 1);
      itemManager.setItemsBelongToPage(current_page, tmp_arr);
      let tmp_chronological_arr = itemManager.getChronologicalArr();
      index = tmp_chronological_arr.indexOf(this.parentNode.innerText);
      tmp_chronological_arr.splice(index, 1);
      itemManager.setChronologicalArr(tmp_chronological_arr);
      this.parentNode.remove();
      if (current_page === 1 && elements.length === 0) return;
      updatePages();
    };
  }

  let current_tasks_2 = document.querySelectorAll("[id=taskname]");
  for (let i = 0; i < current_tasks_2.length; i++) {
    current_tasks_2[i].onclick = function () {
      alert(current_tasks_2[i].parentNode.innerText);
    };
  }
}

function updatePages() {
  current_page = itemManager.getCurrentPage();
  let elements = itemManager.getItemsBelongToPage(current_page);
  if (elements.length === 0) {
    last_page = itemManager.getLastPage();
    itemManager.deleteKeyFromMap(last_page);
    document.getElementById(last_page).remove();
    last_page--;
    itemManager.setLastPage(last_page);
    displayPage(last_page);
  }
  itemManager.fixMapAfterUpdatePage();
  displayPage(current_page);
}

export function clearInputLine() {
  document.getElementById("input").value = "";
}

export function removeElement(elm_id) {
  document.getElementById(elm_id).remove();
}