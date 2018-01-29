const toHtml = function(content, item, itemid) {
  let checked = "";
  if(item.status){
    checked = "checked";
  }
  return `<br><br>${itemid}. <big>${item.toDoItem}</big>
    &nbsp&nbsp<input type = "checkbox" ${checked} id = "${itemid}"
   onclick = "changeStatus(event)"/>&nbsp &nbsp &nbsp &nbsp
   <button id="${itemid}"  onclick = "deleteItem(event)">Delete This Item</button> `;
};

const getAllToDoInHtml = function(content, todo, toFormat) {
  content = content.replace('TITLE', `${todo.title}`);
  content = content.replace('DESCRIPTION', `${todo.description}`);
  let allTodoItem = Object.values(todo.toDoItems || {});
  let itemid = 0;
  let itemsInHtmlForm = '';
  allTodoItem.forEach((item) => {
    itemsInHtmlForm += toFormat(itemsInHtmlForm, item, ++itemid);
  })
  content = content.replace("ITEMS", itemsInHtmlForm);
  return content;
};

exports.toHtml = toHtml;
exports.getAllToDoInHtml = getAllToDoInHtml;
