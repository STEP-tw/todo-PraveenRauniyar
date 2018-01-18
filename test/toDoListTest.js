let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let ToDoList = require('../src/models/toDoList.js');

describe("ToDoList", function () {
  beforeEach(() => {
    toDoList = new ToDoList('DailyRoutine', "TimeTable");
  });
  describe("getTitle()", function () {
    it("It should return title of toDoList", function () {
      assert.equal(toDoList.getTitle(), "DailyRoutine");
    });
  });

  describe("addToDoItem(toDoItemId)", function () {
    it("It should add a toDo item in a toDoList", function () {
      toDoList.addToDoItem("Lunch")
      let expected = {
        '1': {
          toDoItem: 'Lunch',
          status: false
        }
      }
      assert.deepEqual(toDoList.getAllToDoItems(), expected);
    });
    it("It should add multiple to do items in a toDoList", function () {
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

  describe("removeToDoItem(toDoItemId)", function () {
    it("It should remove specific to do Item from a toDoList", function () {
      toDoList.addToDoItem("Breakfast");
      toDoList.removeToDoItem(1);
      assert.deepEqual(toDoList.getAllToDoItems(), {});
    });
    it("It should return all to Do Items when given id is not found", function () {
      toDoList.removeToDoItem(5);
      assert.deepEqual(toDoList.getAllToDoItems(), {});
    });
  });

  describe("editToDoItem(toDoItemId)", function () {
    it("It should edit to do item of given id in toDoList ", function () {
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
  });

  describe("getSpecificToDoItem(toDoItemId)", function () {
    it("It should return specific do Item from toDoList", function () {
      toDoList.addToDoItem("dinner");
      let expected = {
        toDoItem: 'dinner',
        status: false
      };
      assert.deepEqual(toDoList.getSpecificToDoItem(1), expected);
    });
    it("It should return specific toDoItem when multiple items are in toDoList", function () {
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
