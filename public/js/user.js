let AddToList = require("./toDoList.js")
class User {
  constructor(usersName){
    this.userName = usersName;
    this.userAllToDo = {};
  }
  removeToDoList (toDoTitle) {
    delete this.userAllToDo[toDoTitle];
  }
  addToDoList (title,discription,text) {
    let toDo = new ToDoList(title,discription,text);
    this.userAllToDo  = toDo;
  };
}

module.exports = User;
