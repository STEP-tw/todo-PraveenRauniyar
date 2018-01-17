class ToDoItem {
  constructor(toDoText) {
    this.toDoItem = toDoText;
    this.status = false;
  }
  markAsDone() {
    return this.status = true;
  }
  markAsNotDone() {
    return this.status = false;
  }
  isDone() {
    return this.status;
  }

}

module.exports = ToDoItem;
