// Global
const todoList = document.getElementById("todo-list");
let todos = [];
let users = [];
const userSelect = document.getElementById("user-todo");
const form = document.querySelector("form");

// Events

// событие отправки своей задачи

form.addEventListener("submit", handleSubmit);

// Event logic

// запуск логики после загрузки страницы

document.addEventListener("DOMContentLoaded", initApp);

// функция асинхр получения списков

function initApp() {
  Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
    [todos, users] = values;
    todos.forEach((todo) => {
      printTodo(todo);
    });
    users.forEach((user) => createUserOption(user));
  });
}

// кнопка добавление задачи

function handleSubmit(event) {
  event.preventDefault();
  createTodo({
    userId: Number(form.user.value),
    title: form.todo.value,
    completed: false,
  });
}

// Получение id для изменения статуса и линия

function handleTodoChange() {
  const todoId = this.parentElement.dataset.id;
  const completed = this.checked;
  this.nextElementSibling.classList.toggle("line-through");
  toggleTodoComplete(todoId, completed);
}

// получение id задачи для удаления

function handleClose() {
  const todoId = this.parentElement.dataset.id;
  deleteTodo(todoId);
}

// Basic logic

// получаем имена юзеров

function getUserName(userId) {
  const user = users.find((u) => u.id === userId);
  return user.name;
}

// Добавляем задачи из списка дел

function printTodo({ id, userId, title, completed }) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = id;
  li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
    userId
  )}</b></span>`;

  const status = document.createElement("input");
  status.type = "checkbox";
  status.checked = completed;
  if (completed) {
    li.children[0].classList.toggle("line-through");
  }
  status.addEventListener("change", handleTodoChange);

  const close = document.createElement("span");
  close.innerHTML = `&times;`;
  close.className = "close";
  close.addEventListener("click", handleClose);

  li.prepend(status);
  li.append(close);
  todoList.prepend(li);
}

// создаем список пользователей

function createUserOption(user) {
  const option = document.createElement("option");
  option.value = user.id;
  option.innerText = user.name;

  userSelect.append(option);
}

// Удаление задачи со страницы

function removeTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todo.id);
  const todo = todoList.querySelector(`[data-id='${todoId}']`);
  todo.querySelector("input").removeEventListener("change", handleTodoChange);
  todo.querySelector(".close").removeEventListener("click", handleClose);
  todo.remove();
}

// Error

function alertError(error) {
  alert(error.message);
}

// Async logic

// список дел

async function getAllTodos() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    return data;
  } catch (error) {
    alertError(error);
  }
}

// Список юзеров

async function getAllUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    return data;
  } catch (error) {
    alertError(error);
  }
}

// Создаём свою задачу

async function createTodo(todo) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newTodo = await response.json();
    console.log(newTodo);
    printTodo(newTodo);
  } catch (error) {
    alertError(error);
  }
}

// Изменение статуса

async function toggleTodoComplete(todoId, completed) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ completed }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    alertError(error);
  }
}

// Удаление задачи из базы

async function deleteTodo(todoId) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      removeTodo(todoId);
    }
  } catch (error) {
    alertError(error);
  }
}