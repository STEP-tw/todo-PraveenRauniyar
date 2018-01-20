const createRequest = function(){
  let deleteReq = new XMLHttpRequest();
  deleteReq.open('POST','/deleteTodo');
  let todoToDelete = document.getElementById('title');
  deleteReq.send(`title=${todoToDelete}`);
}

const deleteTodo = function () {
  document.getElementById('delete').onclick = createRequest;
};
