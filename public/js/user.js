let ToDoList = require("./toDoList.js");
class User {
  constructor(usersName) {
    this.userName = usersName;
    this.allToDo = {};
  };

  getAllToDoTitle() {
    return Object.keys(this.allToDo);
  };

  getAllToDo(){
    return this.allToDo;
  }

  addToDoList(title, description) {
    let toDoList = new ToDoList(title, description);
    this.allToDo[title] = toDoList;
  };

  removeToDoList(toDoTitle) {
    if(this.allToDo[toDoTitle]){
      delete this.allToDo[toDoTitle];
    };
  };

  getSpecificToDo(title) {
    return this.allToDo[title];
  };

  getToDoItems(title) {
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
};

let user = new User("Praveen");
user.addToDoList("cricket", "shedule");

user.addToDoItem("cricket", "firstMatch");
// console.log(user.getToDoItems("cricket")[0].toDoItem);
// console.log(user.getToDoItems("cricket"));
console.log(user.getSpecificToDo("cricket"));


module.exports = User;
