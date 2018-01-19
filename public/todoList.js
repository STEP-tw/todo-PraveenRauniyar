const reqListener = function() {
  let allTodos = this.responseText;
  document.getElementById('to-do-list').innerHTML = allTodos;
}

const displayTodoList = () => {
  // document.querySelector('#localCount').innerText = ++localCount;

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "/todo");
  oReq.send();
};
window.onload = displayTodoList;
