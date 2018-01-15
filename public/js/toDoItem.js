class ToDo{
  constructor(toDoText){
    this.toDoItemId = "";
    this.status = false;
  }
  markAsDone (){
    this.status = true;
  }
  markAsNotDone (){
    this.status = false;
  }

}

module.exports = ToDo;
