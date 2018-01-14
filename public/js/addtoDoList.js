class AddToDo {
  constructor (title, discription, toDoText) {
    this.title = title;
    this.discription = discription;
    this.Id = new Date().toLocalDateString();
    this.toDoItem = toDoText;
  },
  removeToDoItem : function () {
    delete this.toDoText[toDoText]
  },
  editToDoItem : function(newToDoText){
    this.toDoText[toDoItem] = newToDoItem;
  }
}
