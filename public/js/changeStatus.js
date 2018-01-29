const changeStatus = (event) => {
  let id = event.target.id;
  let item = document.getElementById(id);
  let status = item.checked;
  let oReq = new XMLHttpRequest();
  oReq.open("POST", `/changeStatus/${getTitle()}`);
  oReq.send(`id=${id}&status=${status}`);
};

const deleteItem = (event) => {
  let id = event.target.id;
  let oReq = new XMLHttpRequest();
  oReq.open("POST", `/deleteItem/${getTitle()}`);
  oReq.send(`id=${id}`);
};
