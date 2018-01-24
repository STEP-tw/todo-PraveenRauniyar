const getLink = function(title){
  return `<a href ="/todo/${title}" > ${title}</a><br><br/>`;
}

const reqListener = function() {
  let allTodos = this.responseText;
  let todoListDiv = document.getElementById('to-do-list');
  allTodos = allTodos.split(',');
  let allTitles = '<br/>';
  allTodos.forEach((title)=>{
    allTitles += getLink(title);
  });
  todoListDiv.innerHTML = allTitles + "<br/><br/>";
}

const displayTodoList = () => {
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "/todolist");
  oReq.send();
};
window.onload = displayTodoList;
