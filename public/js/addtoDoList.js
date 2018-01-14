class AddToDo {
  constructor (title, discription, toDoText) {
    this.title = title;
    this.discription = discription;
    this.Id = new Date().toLocalDateString();
    this.toDoItem = toDoText;
  },
  removeToDoList : function () {
    delete this.title;
  },
  removeToDoItem : function () {
    delete this.toDoText[toDoText]
  },
  editToDoItem : function(newToDoText){
    this.toDoText[toDoItem] = newToDoItem;
  }
}
