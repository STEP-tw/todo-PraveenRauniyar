let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let AddToDo = require('../public/js/toDoList.js');

describe("Add to do list test", function() {
  let toDoItem = {1:"Brakfast",2:"Lunch"};
  let addToDo = new AddToDo ('DailyRoutine',"TimeTable",toDoItem)
  it("It should return title which user has given", function() {
    assert.equal(addToDo.getTitle(),"DailyRoutine");
  });
  it("It should remove given to do Item", function() {
    addToDo.removeToDoItem(1);
    assert.deepEqual(addToDo.getToDoItem(),{2:"Lunch"});
  });
  it("It should add given to do item", function() {
    let expected = {2:"Lunch",3 : "dinner"};
    assert.deepEqual(addToDo.addToDoItem(3,"dinner"),expected);
  });
});
