let AddToDo = require("./addToDoList.js")
class User {
  constructor(usersId){
    this.userId = usersId;
    this.userAllToDo = {};
  }
  removeToDoList (toDoTitle) {
    delete this.userAllToDo[toDoTitle];
  }
  AddToDo (title,discription,text) {
    let toDo = new ToDo(title,discription,text);
    this.userAllToDo[toDo.title] = toDo;
  };
}
