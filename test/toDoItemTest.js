let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let ToDoItem = require('../public/js/toDoItem.js');

describe("To Do Item", function() {
  let toDoItem = new ToDoItem ("Breakfast");
  it("By default status should be false", function() {
    assert.isNotOk(toDoItem.status);
  });
  it("status should be true after mark as Done", function() {
    assert.isOk(toDoItem.markAsDone());
  });
  it("status should be false after markAsNotDone ", function() {
    assert.isNotOk(toDoItem.markAsNotDone());
  });
});
