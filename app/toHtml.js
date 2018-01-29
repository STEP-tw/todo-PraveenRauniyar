const toHtml = function(content, item, serialNumber, itemId) {
  let checked = "";
  if(item.status){
    checked = "checked";
  }
  return `<span><br><br>${serialNumber}. <big>${item.toDoItem}</big>
    &nbsp&nbsp<input type = "checkbox" ${checked} id = "${itemId}"
   onclick = "changeStatus(event)"/>&nbsp &nbsp &nbsp &nbsp
   <button id="${itemId}"  onclick = "deleteItem(event)">Delete This Item</button></span> `;
};

const getAllToDoInHtml = function(content, todo, toFormat) {
  content = content.replace('TITLE', `${todo.title}`);
  content = content.replace('DESCRIPTION', `${todo.description}`);
  let allTodoItem = Object.values(todo.toDoItems || {});
  let serialNumber = 0;
  let allItemId = Object.keys(todo.toDoItems)
  let itemsInHtmlForm = '';
  allTodoItem.forEach((item) => {
    let itemId = allItemId[serialNumber];
    itemsInHtmlForm += toFormat(itemsInHtmlForm, item, ++serialNumber,itemId);
  })
  content = content.replace("ITEMS", itemsInHtmlForm);
  return content;
};

exports.toHtml = toHtml;
exports.getAllToDoInHtml = getAllToDoInHtml;
