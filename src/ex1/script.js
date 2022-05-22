let tasks = [];
let page_to_tasks_map = new Map();
let last_page = 1;
let current_page = 1;
let chronological_arr = [];

const addBtn = document.getElementById("push");
const taskToAdd = document.getElementById("input");
const pagination_element = document.getElementById("pagination");
const lexiSortBtn = document.getElementById("lexiSort");
const chronoSortBtn = document.getElementById("chronoSort");

pagination_element.innerHTML = "";
let btn = PaginationButton(current_page);
pagination_element.appendChild(btn);
page_to_tasks_map.set(current_page, tasks);

function updatePages() {
  if (page_to_tasks_map.get(last_page).length === 0) {
    page_to_tasks_map.delete(last_page);
    document.getElementById(last_page).remove();
    last_page--;
    DisplayPage(last_page);
  }
  for (let i = 1; i < page_to_tasks_map.size; i++) {
    if (page_to_tasks_map.get(i).length < 5 && i < page_to_tasks_map.size) {
      moved_num = page_to_tasks_map.get(i + 1).shift();
      page_to_tasks_map.set(i, [...page_to_tasks_map.get(i), moved_num]);
      if (page_to_tasks_map.get(i + 1).length === 0) {
        page_to_tasks_map.delete(i + 1);
        document.getElementById(i + 1).remove();
        last_page--;
      }
    }
  }
  DisplayPage(current_page);
}

function addTaskToHTML(task) {
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
      let index = page_to_tasks_map
        .get(current_page)
        .indexOf(this.parentNode.innerText);
      tmp_arr = page_to_tasks_map.get(current_page);
      tmp_arr.splice(index, 1);
      page_to_tasks_map.set(current_page, tmp_arr);
      index = chronological_arr.indexOf(this.parentNode.innerText);
      chronological_arr.splice(index, 1);
      this.parentNode.remove();
      if (
        current_page === 1 &&
        page_to_tasks_map.get(current_page).length === 0
      )
        return;
      updatePages();
    };
  }

  let current_tasks_2 = document.querySelectorAll('[id=taskname]');
  for (let i = 0; i < current_tasks_2.length; i++) {
    current_tasks_2[i].onclick = function () {
      alert(current_tasks_2[i].parentNode.innerText);
    };
  }
}

function onAddBtnClick() {
  let task = taskToAdd.value;
  if (page_to_tasks_map.size) {
    for (let i = 1; i < page_to_tasks_map.size + 1; i++) {
      let arr_tasks = page_to_tasks_map.get(i);
      if (arr_tasks.includes(task)) {
        alert("task already in, find it at page: " + i);
        taskToAdd.value = "";
        return;
      }
    }
  }
  chronological_arr.push(task);
  if (page_to_tasks_map.get(current_page).length === 5) {
    if (page_to_tasks_map.get(last_page).length === 5) {
      tasks = [];
      tasks.push(task);
      last_page++;
      page_to_tasks_map.set(last_page, tasks);
      document.querySelector("#tasks").innerHTML = ``;

      let btn = PaginationButton(page_to_tasks_map.size);
      pagination_element.appendChild(btn);

      DisplayPage(last_page);
    } else {
      page_to_tasks_map.set(last_page, [
        ...page_to_tasks_map.get(last_page),
        task,
      ]);
      DisplayPage(last_page);
    }
  } else {
    page_to_tasks_map.set(current_page, [
      ...page_to_tasks_map.get(current_page),
      task,
    ]);
    DisplayPage(last_page);
  }
}

function DisplayPage(page) {
  let page_btn = document.getElementById(current_page);
  if (current_page == page) page_btn.classList.add("active");
  current_page = page;
  elements = page_to_tasks_map.get(current_page);
  document.querySelector("#tasks").innerHTML = ``;
  for (let i = 0; i < elements.length; i++) {
    addTaskToHTML(elements[i]);
  }
  let current_btn = document.querySelector(".pagenumbers button.active");
  if (current_btn) {
    current_btn.classList.remove("active");
    let new_page_btn = document.getElementById(current_page);
    new_page_btn.classList.add("active");
  }
}

function PaginationButton(page) {
  let button = document.createElement("button");
  button.innerText = page;
  button.id = page;

  if (current_page == page) button.classList.add("active");

  button.addEventListener("click", function () {
    DisplayPage(page);
    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");
    button.classList.add("active");
  });
  return button;
}

addBtn.addEventListener("click", ({ target }) => {
  if (taskToAdd.value.trim().length === 0) {
    alert("Undefined input");
    taskToAdd.value = "";
  } else {
    onAddBtnClick();
  }
});

taskToAdd.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("push").click();
  }
});

lexiSortBtn.addEventListener("click", ({ target }) => {
  if (page_to_tasks_map.get(1).length === 0) alert("first add todo's");
  else sortLexicographically();
});

chronoSortBtn.addEventListener("click", ({ target }) => {
  if (page_to_tasks_map.get(1).length === 0) alert("first add todo's");
  else chronologicalSort();
});

function sortLexicographically() {
  let lexicographically_arr = [];
  for (let i = 1; i < page_to_tasks_map.size + 1; i++) {
    let tmp_list = page_to_tasks_map.get(i);
    for (let j = 0; j < tmp_list.length; j++) {
      lexicographically_arr.push(tmp_list[j]);
    }
  }
  lexicographically_arr.sort();
  mySort(lexicographically_arr.slice());
}

function chronologicalSort() {
  mySort(chronological_arr.slice());
}

function mySort(array) {
  let key = 1;
  let len = array.length;
  for (let i = 0; i < len; i++) {
    let tmp_list = [];
    if (array.length > 5) {
      for (let j = 0; j < 5; j++) {
        tmp_list.push(array.shift());
      }
      page_to_tasks_map.set(key, tmp_list);
      key++;
    } else {
      page_to_tasks_map.set(key, array);
      break;
    }
  }
  DisplayPage(1);
}