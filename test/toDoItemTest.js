let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let ToDoItem = require('../models/toDoItem.js');

describe("To Do Item", function() {
  beforeEach(() => {
    toDoItem = new ToDoItem("Breakfast");
  });
  describe("markAsDone()", function() {
    it("status should be true after marking a toDoItem as done", function() {
      toDoItem.markAsDone();
      assert.isOk(toDoItem.status);
    });
  });

  describe("markAsNotDone()", function() {
    it("status should be false after marking a toDoItem as not done", function() {
      toDoItem.markAsNotDone();
      assert.isNotOk(toDoItem.status);
    });
  });

  describe("isDone()", function() {
    it("It should be initially false for a toDoItem", function() {
      assert.isNotOk(toDoItem.isDone());
    });
  });

  describe("getToDoItem()", function() {
    it("It should return toDo Item", function() {
      assert.equal(toDoItem.getToDoItem(),"Breakfast");
    });
  });
});
