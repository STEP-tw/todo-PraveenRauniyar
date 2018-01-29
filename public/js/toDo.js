const addToDoItem = function () {
  let tagForGap = document.createElement("br");
  let form = document.getElementById("toDo");
  let inputBox = document.createElement("input");
  inputBox.type = "text";
  inputBox.className = "name-Box";
  inputBox.name = "toDoItem";
  inputBox.required = true;
  form.appendChild(inputBox);
  form.appendChild(tagForGap);
};
