let AddComment = function (title,discription,text) {
  this.title = title;
  this.discription = discription;
  this.data = new Date().toLocalDateString();
  this.text = text;
};
