let ToDoList = require("./toDoList.js");
class User {
  constructor(usersName) {
    this.userName = usersName;
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

  removeToDoList(toDoTitle) {
    if (this.allToDo[toDoTitle]) {
      delete this.allToDo[toDoTitle];
    };
  };

  getSpecificToDo(title) {
    return this.allToDo[title];
  };

  getAllToDoItems(title) {
    return this.getSpecificToDo(title).getAllToDoItems();
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
    this.getSpecificToDoItem(title, toDoItemId).markAsDone();
  };

  markAsNotDone(title, toDoItemId) {
    this.getSpecificToDoItem(title, toDoItemId).markAsNotDone();
  };

  isDone(title, toDoItemId) {
    this.getSpecificToDoItem(title, toDoItemId).isDone();
  };
};

let user = new User("Praveen");
user.addToDoList("cricket", "shedule");

user.addToDoItem("cricket", "firstMatch");
// console.log(user.getToDoItems("cricket")[0].toDoItem);
// console.log(user.getToDoItems("cricket"));



module.exports = User;
