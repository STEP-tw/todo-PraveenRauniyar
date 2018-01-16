let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let ToDoList = require('../public/js/toDoList.js');

describe("Add to do list test", function() {
  let toDoList = new ToDoList ('DailyRoutine',"TimeTable",{})
  it("It should return title which user has given", function() {
    assert.equal(toDoList.getTitle(),"DailyRoutine");
  });
  it("It should add to do item", function() {
    let expected = { '1': { toDoItem: 'dinner', status: false } }
    assert.deepEqual(toDoList.addToDoItem("dinner"),expected);

  });
  it("It should remove specific to do Item", function() {
    toDoList.removeToDoItem(1);
    assert.deepEqual(toDoList.getToDoItem(),{});
    toDoList.addToDoItem("dinner")
  });
});
