const handleResponse = function(){
  let location = this.getResponseHeader('location');
  window.location = location;
}

const getTitle = ()=>{
  let todoTitle = document.getElementById('title').innerText;
  return todoTitle.slice(6);
}

const createRequest = function() {
  let deleteReq = new XMLHttpRequest();
  deleteReq.open('POST','/deleteTodo');
  deleteReq.setRequestHeader('location','/');
  deleteReq.addEventListener('load',handleResponse);
  deleteReq.send(`title=${getTitle()}`);
}

const showFormToEdit = function(){
  let formContent = this.responseText;
  document.body.innerHTML = formContent;
}

const editRequest = function(){
  let editReq = new XMLHttpRequest();
  let title = document.getElementById('id')
  editReq.open('GET',`/editTodo${getTitle()}`);
  editReq.addEventListener('load',showFormToEdit);
  editReq.send();

}

const addListeners = function(){
  document.getElementById('delete').onclick = createRequest;
  document.getElementById('edit').onclick = editRequest;
  document.getElementById('addTodoItem').onclick = addInputBox;
}
window.onload = addListeners;
