const changeStatus = (event) => {
  let id = event.target.id;
  let item = document.getElementById(id);
  let status = item.checked;
  let oReq = new XMLHttpRequest();
  oReq.open("POST", "/changeStatus");
  oReq.send(`title=${getTitle()}&id=${id}&status=${status}`);
};
