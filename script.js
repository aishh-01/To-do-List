// script.js

const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add a new task
addButton.addEventListener('click', addTask);

// Drag-and-drop events
todoList.addEventListener('dragstart', dragStart);
todoList.addEventListener('dragover', dragOver);
todoList.addEventListener('drop', drop);

function addTask() {
  const taskText = todoInput.value.trim();
  if (taskText === '') return;

  createTaskElement(taskText);
  saveTask(taskText);

  todoInput.value = '';
}

function createTaskElement(taskText, isCompleted = false) {
  const li = document.createElement('li');
  li.className = `todo-item${isCompleted ? ' completed' : ''}`;
  li.draggable = true;

  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.value = taskText;
  taskInput.readOnly = true;

  const editBtn = document.createElement('button');
  editBtn.innerHTML = '✏️';
  editBtn.className = 'edit-btn';
  editBtn.addEventListener('click', () => toggleEdit(taskInput, li));

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => deleteTask(li, taskText));

  li.appendChild(taskInput);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  li.addEventListener('dblclick', () => toggleComplete(li, taskText));

  todoList.appendChild(li);
}

function toggleEdit(taskInput, li) {
  const isEditable = taskInput.readOnly;
  if (isEditable) {
    taskInput.readOnly = false;
    taskInput.focus();
    taskInput.addEventListener('blur', () => saveEditedTask(taskInput, li));
  }
}

function saveEditedTask(taskInput, li) {
  taskInput.readOnly = true;
  updateTaskInLocalStorage(li, taskInput.value);
}

function toggleComplete(li, taskText) {
  li.classList.toggle('completed');
  updateTaskInLocalStorage(li, taskText);
}

function deleteTask(li, taskText) {
  li.remove();
  removeTaskFromLocalStorage(taskText);
}

// Save task to local storage
function saveTask(taskText) {
  const tasks = getTasks();
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove task from local storage
function removeTaskFromLocalStorage(taskText) {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Update task in local storage
function updateTaskInLocalStorage(li, newText) {
  const tasks = getTasks();
  const taskIndex = [...todoList.children].indexOf(li);
  tasks[taskIndex].text = newText;
  tasks[taskIndex].completed = li.classList.contains('completed');
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => createTaskElement(task.text, task.completed));
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Drag-and-drop logic
let draggedItem;

function dragStart(e) {
  draggedItem = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (e.target.classList.contains('todo-item')) {
    const draggedIndex = [...todoList.children].indexOf(draggedItem);
    const targetIndex = [...todoList.children].indexOf(e.target);

    if (draggedIndex > targetIndex) {
      todoList.insertBefore(draggedItem, e.target);
    } else {
      todoList.insertBefore(draggedItem, e.target.nextSibling);
    }

    saveReorderedTasks();
  }
}

function saveReorderedTasks() {
  const tasks = [...todoList.children].map(li => ({
    text: li.querySelector('input').value,
    completed: li.classList.contains('completed'),
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
