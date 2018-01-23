
const addItem = function(){
  let editReq = new XMLHttpRequest();
  let item = document.getElementsByName('item')[0];
  editReq.open('POST',`/addItem`);
  editReq.addEventListener('load',()=>{
    console.log("done");
  });
  editReq.send(`title=${getTitle()}&item=${item.value}`);
}

const addInputBox = function(){
  let inputArea = document.getElementById('inputArea');
  let inputBox = document.createElement('input');
  inputBox.type = "text";
  inputBox.name = "item";
  inputBox.onchange = addItem;
  inputArea.appendChild(inputBox);
}
