class AddToDo {
  constructor (title, discription, text) {
    this.title = title;
    this.discription = discription;
    this.Id = new Date().toLocalDateString();
    this.text = text;
  },
  deleteToDoList : function () {
    this.title = "";
  }
}
