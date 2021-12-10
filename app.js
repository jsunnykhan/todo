"use strict";

// selectors
const inputText = document.querySelector(".todo__input");
const searchInput = document.querySelector(".search__input");
const updatedInput = document.querySelector(".update__text");
const todoListDiv = document.querySelector(".todo__list");
const popup = document.querySelector(".popup");
const updatePopup = document.querySelector(".popup_update");

const inputButton = document.querySelector(".todo__button");
const searchButton = document.querySelector(".search__button");
const deleteConfirm = document.querySelector(".popup__yesbtn");
const deleteCancel = document.querySelector(".popup__nobtn");
const updateSave = document.querySelector(".popup__savebtn");
const updateCancel = document.querySelector(".popup__cancelbtn");
const checkButton = document.getElementsByClassName("done__button");

// click Handler
inputButton.addEventListener("click", addNewTodo);
searchButton.addEventListener("click", searchTodo);
todoListDiv.addEventListener("click", checkUpdateDeleteHandler);

updateDom();

function updateDom(todo) {
  todoListDiv.innerText = "";
  const todos = todo ? todo : getData();

  todos.forEach((obj) => {
    todoListDiv.insertAdjacentHTML(
      "beforeend",
      `<div class="todo">
            <button class="done__button"><i class="fas fa-check"></i></button>
            <li class=${obj.isDone ? "complete" : ""}>${obj.todo}</li>
            <button class="update__button"><i class="fas fa-pen"></i></button>
            <button class="delete__button"><i class="fas fa-trash"></i></button>
        </div>`
    );
  });
}

function addNewTodo(e) {
  e.preventDefault();
  const data = inputText.value;

  if (data) {
    const newTodo = {
      _id: randomId(),
      todo: data.trim(),
      date: new Date(),
      isDone: false,
    };
    inputText.value = "";
    saveData(newTodo);
    updateDom();
  } else {
    alert("Enter a todo");
  }
}

function searchTodo(e) {
  e.preventDefault();
  const data = searchInput.value;
  if (data) {
    const todos = getData();

    const sortData = [];

    todos.forEach((value) => {
      if (value.todo.includes(data)) {
        sortData.push(value);
      }
    });

    console.log(sortData.length);
    if (sortData.length) {
      setTimeout(() => updateDom(sortData), 2000);
    } else {
      todoListDiv.innerHTML = "";
      todoListDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="todo">
            <li>No Data Found</li>
           </div>`
      );
    }
  } else {
    alert("No keyword found");
  }
}

searchInput.onkeyup = function (e) {
  e.preventDefault();
  const data = this.value;
  if (data.length === 0) {
    updateDom();
  }
};

function checkUpdateDeleteHandler(event) {
  let item = event.target;
  if (item.classList[0] === "done__button") {
    checkTodo(item.parentElement);
  } else if (item.classList[0] === "update__button") {
    updateTodo(event, item.parentElement);
  } else if (item.classList[0] === "delete__button") {
    deleteTodo(item.parentElement);
  }
}

// check todo list
function checkTodo(element) {
  const data = element.children[1].innerText;
  const todoList = getData();
  const index = todoList.findIndex((val) => val.todo === data);
  todoList[index].isDone = !todoList[index].isDone;
  saveData(todoList, true);
  updateDom();
}

// update todo list
let updatElementeData;
function updateTodo(event, element) {
  event.stopPropagation();
  updatePopup.style.display = "block";
  updatElementeData = element.children[1].innerText;
}

updateSave.addEventListener("click", (e) => {
  const todos = getData();
  const index = todos.findIndex((val) => val.todo === updatElementeData);
  console.log("The update index " + index);
  let sortData;
  if (index !== -1) {
    sortData = todos[index];
  }
  const inputValue = updatedInput.value;
  todos.forEach((obj) => {
    if (obj._id === sortData._id) {
      obj.todo = inputValue;
    }
  });
  saveData(todos, true);
  updateDom();
  updatedInput.value = "";
  updatePopup.style.display = "none";
});

updateCancel.addEventListener("click", () => {
  updatePopup.style.display = "none";
});

//delete todo list
let deleteData;
function deleteTodo(element) {
  popup.style.display = "block";
  deleteData = element.children[1].innerText;
}

deleteConfirm.addEventListener("click", function (event) {
  event.stopPropagation();
  const todoData = getData();
  const index = todoData.findIndex((val) => val.todo === deleteData);
  todoData.splice(index, 1);
  console.log(todoData);
  saveData(todoData, true);
  updateDom();
  popup.style.display = "none";
});

deleteCancel.addEventListener("click", function (event) {
  event.stopPropagation();
  event.preventDefault();
  popup.style.display = "none";
});

// save data in local storage
function saveData(todo, params) {
  let tod;

  if (localStorage.getItem("todos") == null) {
    tod = [];
  } else {
    tod = JSON.parse(localStorage.getItem("todos"));
  }

  if (!params) {
    tod.push(todo);
    localStorage.setItem("todos", JSON.stringify(tod));
  } else {
    tod = todo;
    localStorage.setItem("todos", JSON.stringify(tod));
  }
}

// get Data from local server
function getData() {
  try {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    if (todos) {
      return todos;
    }
  } catch (error) {
    console.log("Server issue : " + error);
  }
}

function randomId() {
  let id = "";
  for (let index = 0; index < 10; index++) {
    id += Math.trunc(Math.random() * 10).toString();
  }
  return id;
}

/**
 *
 * github.com/jsunnykhan/todo
 *
 */
