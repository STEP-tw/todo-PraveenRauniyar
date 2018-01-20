const handleResponse = function(){
  let location = this.getResponseHeader('location');
  window.location = location;
}
const createRequest = function() {
  let deleteReq = new XMLHttpRequest();
  deleteReq.open('POST','/deleteTodo');
  deleteReq.setRequestHeader('location','/');
  deleteReq.addEventListener('load',handleResponse);
  let todoToDelete = document.getElementById('title').innerText;
  deleteReq.send(`title=${todoToDelete.slice(6)}`);
}

const deleteTodo = function() {
  document.getElementById('delete').onclick = createRequest;
}
window.onload = deleteTodo;
