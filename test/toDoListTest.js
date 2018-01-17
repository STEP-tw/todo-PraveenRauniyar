let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let ToDoList = require('../public/js/toDoList.js');

describe("Add to do list test", function() {
  beforeEach(() => {
    toDoList = new ToDoList('DailyRoutine', "TimeTable");
  });
  describe("getTitle()", function() {
    it("It should return title which user has given", function() {
      assert.equal(toDoList.getTitle(), "DailyRoutine");
    });
  });

  describe("addToDoItem(toDoItemId)", function() {
    it("It should add to do item", function() {
      toDoList.addToDoItem("Lunch")
      let expected = {
        '1': {
          toDoItem: 'Lunch',
          status: false
        }
      }
      assert.deepEqual(toDoList.getAllToDoItems(), expected);
    });
    it("It should add multiple to do item", function() {
      toDoList.addToDoItem("dinner");
      toDoList.addToDoItem("Breakfast");
      let expected = {
        '1': {
          toDoItem: 'dinner',
          status: false
        },
        '2': {
          toDoItem: 'Breakfast',
          status: false
        }
      };
      assert.deepEqual(toDoList.getAllToDoItems(), expected);
    });
  });

  describe("removeToDoItem(toDoItemId)", function() {
    it("It should remove specific to do Item", function() {
      toDoList.addToDoItem("Breakfast");
      toDoList.removeToDoItem(1);
      assert.deepEqual(toDoList.getAllToDoItems(), {});
    });
    it("It should return all available to Do Items when given id is not available", function() {
      toDoList.removeToDoItem(5);
      assert.deepEqual(toDoList.getAllToDoItems(), {});
    });
  });

  describe("editToDoItem(toDoItemId)", function() {
    it("It should edit to do item of given id ", function() {
      toDoList.addToDoItem("dinner");
      toDoList.editToDoItem(1, "Breakfast")
      let expected = {
        '1': {
          toDoItem: 'Breakfast',
          status: false
        }
      }
      assert.deepEqual(toDoList.getAllToDoItems(), expected);
    });
    it("It should return same to do items when id is not available  ", function() {
      toDoList.addToDoItem("dinner");
      toDoList.editToDoItem(2, "Breakfast")
      let expected = {
        '1': {
          toDoItem: 'dinner',
          status: false
        }
      }
      assert.deepEqual(toDoList.getAllToDoItems(), expected);
    });
  });

  describe("getSpecificToDoItem(toDoItemId)", function() {
    it("It should return specific do Item", function() {
      toDoList.addToDoItem("dinner");
      let expected = {
        toDoItem: 'dinner',
        status: false
      };
      assert.deepEqual(toDoList.getSpecificToDoItem(1), expected);
    });
    it("It should return specific do to when more than one item available", function() {
      toDoList.addToDoItem("Potato");
      toDoList.addToDoItem("Paneer");
      let expected = {
        toDoItem: 'Paneer',
        status: false
      };
      assert.deepEqual(toDoList.getSpecificToDoItem(2), expected);
    });
  });
});
