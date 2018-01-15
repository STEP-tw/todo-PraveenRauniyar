class AddToDo {
  constructor (title, description, toDoText) {
    this.title = title;
    this.description = description;
    this.Id = new Date()
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
  addToDoItem (toDoItemId,toDoText) {
    this.toDoItem[toDoItemId] = toDoText;
    return this.toDoItem;
  }
  editToDoItem (toDoItemId,newTodoText) {
    this.toDoItem[toDoItemId] = newTodoText;
  }


};

module.exports = AddToDo;
