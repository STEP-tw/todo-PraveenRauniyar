let ToDoItem = require("./toDoItem.js")
class ToDoList {
  constructor (title, description, toDoText) {
    this.counter = 1;
    this.title = title;
    this.description = description;
    this.toDoItem = toDoText;
  }
   getTitle () {
    return this.title;
  }
   getToDoItem(){
    return this.toDoItem;
  }
  removeToDoItem (toDoItemId) {
    delete this.toDoItem[toDoItemId]
  }
  addToDoItem (toDoText) {
    let toDoItemId = this.counter++;
    let toDo = new ToDoItem(toDoText);
    this.toDoItem[toDoItemId] = toDo;
    return this.toDoItem;
  }
  editToDoItem (toDoTitle,newTodoText) {
    this.toDoItem[toDoTitle] = newTodoText;
  }
};

module.exports = ToDoList;
