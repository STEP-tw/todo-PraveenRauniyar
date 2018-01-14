let addToDo = require("./addToDoList.js")
class User {
  constructor(usersName,userAllToDo){
    this.usersName = usersId;
    this.userAllToDo = {};
  }
  removeToDoList : function () {
    delete this.userAllToDo[title];
  },
  AddToDo : function (title,discription,text) {
    let toDo = new ToDo(title,discription,text);
    this.userAllToDo[toDo.title] = toDo;
  };

}
