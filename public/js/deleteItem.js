const deleteItem = (event) => {
  let id = event.target.id;
  // let deleteButton = event.target;
  // deleteButton.parentElement.parentElement.remove();
  let item = document.getElementById(id);
  let oReq = new XMLHttpRequest();
  oReq.open("POST", `/deleteItem/${getTitle()}`);
  oReq.send(`id=${id}`);
};
