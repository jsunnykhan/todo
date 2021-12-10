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

// functions

// init

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
      todo: data.trim(),
      data: new Date(),
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
    updateTodo(item.parentElement);
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

// // update todo list
function updateTodo(element) {
  updatePopup.style.display = "block";

  const data = element.children[1].innerText;
    const todos = getData();
    const index = todos.findIndex((val) => val.todo === data);
    console.log("The update index " + index);
    if (index >= 0) {
      console.log(todos[index]);
    }
  updateSave.addEventListener("click", (e) => {
    e.preventDefault();
    
    // const index = todos.findIndex((val) => val.todo === data);
    // todos[index].todo = updatedInput.value;
    // saveData(todos);
    // updateDom();
    updatePopup.style.display = "none";
  });
  updateCancel.addEventListener("click", () => {
    updatePopup.style.display = "none";
    return;
  });
}

// //delete todo list
// function deleteTodo(element) {
//   popup.style.display = "block";
//   const data = element.children[1].innerText;
//   const todoData = getDataFromLocalServer();

//   deleteConfirm.addEventListener("click", function (event) {
//     event.preventDefault();
//     const todoData = getDataFromLocalServer();
//     const index = todoData.findIndex((val) => val.todo === data);
//     todoData.splice(index, 1);
//     console.log(todoData);
//     saveDataInLocalStorage(todoData);
//     updateDom();
//     popup.style.display = "none";
//   });
//   deleteCancel.addEventListener("click", function (event) {
//     event.preventDefault();
//     popup.style.display = "none";
//     return;
//   });
// }

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

// // create a new todo
// function createNewTodo(event) {
//   event.preventDefault();
//   const data = inputText.value;
//   if (data) {
//     inputText.value = "";
//     const newData = {
//       todo: data.trim(),
//       isDone: false,
//     };
//     saveDataInLocalStorage(newData);
//     updateDom();
//   } else {
//     alert("Enter a todo");
//   }
// }

// // search todo
// function searchTodo(event) {
//   event.preventDefault();

//   const data = searchInput.value;
//   if (data) {
//     const sortedData = todos.filter((obj) =>
//       Object.values(obj).some((value) => {
//         console.log(typeof value, value);
//         if (value === typeof String) {
//           return value.includes(data);
//         }
//       })
//     );
//     console.log(sortedData);
//     if (sortedData.length > 0) {
//       setTimeout(() => {
//         updateDom(sortedData);
//       }, 2000);
//     } else {
//       todoListDiv.innerHTML = "";
//       todoListDiv.insertAdjacentHTML(
//         "beforeend",
//         `<div class="todo">
//           <li>No Data Found</li>
//          </div>`
//       );
//     }
//   } else {
//     alert("Please enter a keyword");
//   }
// }

// // follow keyStoke and search
// searchInput.onkeyup = function () {
//   const data = this.value;
//   if (data.length === 0) {
//     updateDom();
//   }
//   //   else {
//   //     const sortedData = todos.filter((obj) =>
//   //       Object.values(obj).some((value) => value.includes(data))
//   //     );

//   //     if (sortedData.length > 0) {
//   //       updateDom(sortedData);
//   //     } else {
//   //       todoListDiv.innerHTML = "";
//   //       todoListDiv.insertAdjacentHTML(
//   //         "beforeend",
//   //         `<div class="todo">
//   //           <li>No Data Found</li>
//   //           </div>`
//   //       );
//   //     }
//   //   }
// };

// function checkUpdateDeleteHandler(event) {
//   let item = event.target;
//   // console.log(item);

//   if (item.classList[0] === "done__button") {
//     checkTodo(item.parentElement);
//   } else if (item.classList[0] === "update__button") {
//     updateTodo(item.parentElement);
//   } else if (item.classList[0] === "delete__button") {
//     deleteTodo(item.parentElement);
//   }
// }

// // check todo list
// function checkTodo(element) {

//   console.log();

//   const data = element.children[1].innerText;
//   const todoList = getDataFromLocalServer();
//   const index = todoList.findIndex((val) => val.todo === data);
//   todoList[index].isDone = !todoList[index].isDone;
//   saveDataInLocalStorage(todoList);
//   updateDom();
// }

// // //Update dom
// function updateDom() {
//   todoListDiv.innerHTML = "";
//   const listOfTodo = getDataFromLocalServer();
//   listOfTodo.forEach((value) =>
//     todoListDiv.insertAdjacentHTML(
//       "beforeend",
//       `<div class="todo">
//       <button class="done__button"><i class="fas fa-check"></i></button>
//       <li class=${value.isDone ? "complete" : ""}>${value.todo}</li>
//       <button class="update__button"><i class="fas fa-pen"></i></button>
//       <button class="delete__button"><i class="fas fa-trash"></i></button>
//     </div>`
//     )
//   );
// }
