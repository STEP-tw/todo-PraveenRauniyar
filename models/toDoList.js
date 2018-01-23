let ToDoItem = require("./toDoItem.js");
class ToDoList {
  constructor(title, description) {
    this.noOfItems = 0;
    this.title = title;
    this.description = description;
    this.toDoItems = {};
  };
  getTitle() {
    return this.title;
  };
  editTitles(newTitle) {
    return this.title = newTitle;
  };
  getAllToDoItems() {
    return this.toDoItems;
  };
  removeToDoItem(toDoItemId) {
    if (this.toDoItems[toDoItemId]) {
      delete this.toDoItems[toDoItemId]
    }
    return this.toDoItems;
  };
  addToDoItem(toDoText) {
    let toDo = new ToDoItem(toDoText);
    let toDoItemId = ++this.noOfItems;
    this.toDoItems[toDoItemId] = toDo;
    return this.toDoItems;
  };
  editToDoItem(toDoItemId, newTodoText) {
    if (this.toDoItems[toDoItemId]) {
      this.toDoItems[toDoItemId] = new ToDoItem(newTodoText);
    };
    return this.toDoItems;
  };
  getSpecificToDoItem(toDoItemId) {
    return this.toDoItems[toDoItemId];
  };
  markAsDone(toDoItemId) {
    return this.getSpecificToDoItem(toDoItemId).status = true;
  };
  markAsNotDone(toDoItemId) {
    return this.getSpecificToDoItem(toDoItemId).status = false;
  };
};

module.exports = ToDoList;
