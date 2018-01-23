// const showMsg = ()=>{
//   console.log(this.responseText);
//   let msgBox = document.getElementsByTagName('p')[0];
//   msgBox.innerText = this.responseText;
// };

const changeStatus = (event) => {
  let id = event.target.id;
  let item = document.getElementById(id);
  let status = item.checked;
  let oReq = new XMLHttpRequest();
  oReq.open("POST", "/changeStatus");
  // oReq.addEventListener('load',showMsg);
  oReq.send(`title=${getTitle()}&id=${id}&status=${status}`);
};
