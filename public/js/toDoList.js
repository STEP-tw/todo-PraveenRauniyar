class AddToDo {
  constructor (title, discription, toDoText) {
    this.title = title;
    this.discription = discription;
    this.Id = new Date()
    this.toDoItem = toDoText;
  }
  getTitle () {
    return this.title;
  }
  getToDoItem(){
    return this.toDoItem;
  }
  removeToDoItem (toDoItem) {
    delete this.toDoItem[toDoItem]
  }
  addToDoItem (toDoItemNumber,toDoText) {
    this.toDoItem[toDoItemNumber] = toDoText;
    console.log(this.toDoItem);
    return this.toDoItem;
  }
};

module.exports = AddToDo;
