let ToDoList = require("./toDoList.js");
class User {
  constructor(userName,password) {
    this.userName = userName;
    this.password = password;
    this.allToDo = {};
  };

  getAllToDoTitle() {
    return Object.keys(this.allToDo);
  };

  getAllToDo() {
    return this.allToDo;
  }

  addToDoList(title, description) {
    let toDoList = new ToDoList(title, description);
    this.allToDo[title] = toDoList;
  };

  getAllToDoItems(title) {
    return this.getSpecificToDo(title).getAllToDoItems();
  };

  editTitles(title,newTitle) {
    this.getSpecificToDo(title).editTitles(newTitle);
    this.allToDo[newTitle] = this.allToDo[title];
    delete this.allToDo[title];
  };

  removeToDoList(toDoTitle) {
    if (this.allToDo[toDoTitle]) {
      delete this.allToDo[toDoTitle];
    };
  };

  getSpecificToDo(title) {
    return this.allToDo[title];
  };



  addToDoItem(title, toDoText) {
    this.getSpecificToDo(title).addToDoItem(toDoText);
  };

  removeToDoItem(title, toDoItemId) {
    this.getSpecificToDo(title).removeToDoItem(toDoItemId);
  };

  editToDoItem(title, toDoItemId, newTodoText) {
    this.getSpecificToDo(title).editToDoItem(toDoItemId, newTodoText);
  };

  getSpecificToDoItem(title, toDoItemId) {
    return this.getSpecificToDo(title).getSpecificToDoItem(toDoItemId);
  };

  markAsDone(title, toDoItemId) {
    return this.getSpecificToDoItem(title, toDoItemId).markAsDone();
  };

  markAsNotDone(title, toDoItemId) {
    return this.getSpecificToDoItem(title, toDoItemId).markAsNotDone();
  };

  isDone(title, toDoItemId) {
    return this.getSpecificToDoItem(title, toDoItemId).isDone();
  };
  getToDoItem (title, toDoItemId) {
    return this.getSpecificToDoItem(title, toDoItemId).getToDoItem();
  };
};

module.exports = User;
