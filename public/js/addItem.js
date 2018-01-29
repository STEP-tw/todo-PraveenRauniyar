const addItem = function(){
  let editReq = new XMLHttpRequest();
  let items = document.getElementsByName('item');
  let item = items[items.length - 1];
  editReq.open('POST',`/addItem`);
  editReq.send(`title=${getTitle()}&item=${item.value}`);
}

const addInputBox = function(){
  let inputArea = document.getElementById('inputArea');
  let inputBox = document.createElement('input');
  let tagForGap = document.createElement('br');
  inputBox.type = "text";
  inputBox.name = "item";
  inputBox.onchange = addItem;
  inputArea.appendChild(inputBox);
  inputArea.appendChild(tagForGap);
}
