let ToDoList = require("./toDoList.js");
class User {
  constructor(usersName){
    this.userName = usersName;
    this.allToDo = {};
  };
  getAllToDoLists (){
    return Object.keys(this.allToDo);
  };
  removeToDoList (toDoTitle) {
    delete this.allToDo[toDoTitle];
  };
  addToDoList (title,description) {
    let toDoList = new ToDoList(title,description);
    this.allToDo[title]  = toDoList;
  };
  getToDoList (title){
    return this.allToDo[title];
  };
  getToDoItem(title){
    return this.getToDoList(title).getToDoItem();
  };
  addToDoItem (title,toDoText) {
    this.getToDoList(title).addToDoItem(toDoText);
  };
  removeToDoItem (title,toDoItemId) {
    this.getToDoList(title).removeToDoItem(toDoItemId);
  };
  editToDoItem (title,toDoItemId,newTodoText) {
    this.getToDoList(title).editToDoItem(toDoItemId,newTodoText)
  };
};



module.exports = User;
