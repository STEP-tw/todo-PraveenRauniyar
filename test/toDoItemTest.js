let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let ToDoItem = require('../public/js/toDoItem.js');

describe("To Do Item", function() {
  beforeEach(() => {
    toDoItem = new ToDoItem("Breakfast");
  });
  describe("markAsDone()", function(){
    it("By default status should be false", function() {
      assert.isNotOk(toDoItem.status);
    });
    it("status should be true after mark as Done", function() {
      toDoItem.markAsDone();
      assert.isOk(toDoItem.status);
    });
  });
  describe("markAsNotDone()", function(){
    it("status should be false after mark as not Done", function() {
      toDoItem.markAsNotDone();
      assert.isNotOk(toDoItem.status);
    });
  });
  describe("isDone()", function(){
    it("It should be true after mark as done", function() {
      toDoItem.markAsDone();
      assert.isOk(toDoItem.isDone());
    });
    it("It should be false after mark as done", function() {
      toDoItem.markAsNotDone();
      assert.isNotOk(toDoItem.isDone());
    });
    it("It should be false after mark as done after mark as not done", function() {
      toDoItem.markAsDone();
      toDoItem.markAsNotDone();
      assert.isNotOk(toDoItem.isDone());
    });
  });

});
