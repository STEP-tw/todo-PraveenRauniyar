let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let User = require('../public/js/user.js');

describe("user", function() {
  beforeEach(() => {
    user = new User("Praveen");
  });
  describe("getAllToDoTitles() should give all to do lists", function() {
    it("It should return empty list in starting", function() {
      assert.deepEqual(user.getAllToDoTitle(), []);
    });
    it("It should return list of ToDo", function() {
      user.addToDoList("App", "Create App")
      user.addToDoList("Cricket Tournament", "Arrangement of cricket tournament")
      assert.deepEqual(user.getAllToDoTitle(), ["App", "Cricket Tournament"]);
    });
  });

  describe("addToDoList() should add to do lists", function() {
    it("It should add to do ", function() {
      user.addToDoList("App", "createApp");
      let expected = {
        "App": {
          "description": "createApp",
          noOfItems: 0,
          title: "App",
          toDoItems: {}
        }
      }
      assert.deepEqual(user.getAllToDo(), expected);
    });
    it("It should add multiple ToDo list", function() {
      user.addToDoList("App", "Create App")
      user.addToDoList("Cricket Tournament", "Arrangement of cricket tournament")
      assert.deepEqual(user.getAllToDoTitle(), ["App", "Cricket Tournament"]);
    });
  });

  describe("removeToDoList(title) should remove to do lists", function() {
    it("It should remove given to do ", function() {
      user.addToDoList("App", "createApp");
      user.removeToDoList("App")
      assert.deepEqual(user.getAllToDo(), {});
    });
    it("It should remove toDoList when it available either nothing to do", function() {
      user.removeToDoList("Cricket");
      assert.deepEqual(user.getAllToDo(), {});
    });
  });

  describe("getSpecificToDo(title) should add to do lists", function() {
    it("It should give to do of given toDoTitle", function() {
      user.addToDoList("App", "createApp");
      user.addToDoList("Play", "cricket");
      let expected = {
        noOfItems: 0,
        title: 'Play',
        description: 'cricket',
        toDoItems: {}
      }
      assert.deepEqual(user.getSpecificToDo("Play"), expected);
    });
  });

  describe("addToDoItem(title,toDoText) should add to do Item in given toDo", function() {
    beforeEach(() => {
      user.addToDoList("App", "createApp");
      user.addToDoList("Cricket", "play");
    });
    it("It should add toDoItem in given toDo", function() {
      user.addToDoItem("Cricket", "Play at 10am");
      let expected = {
        noOfItems: 1,
        title: 'Cricket',
        description: 'play',
        toDoItems: {
          '1': {
            toDoItem: 'Play at 10am',
            status: false
          }
        }
      }
      assert.deepEqual(user.getSpecificToDo("Cricket"), expected);
    });
  });

  describe("removeToDoItem(title,toDoId) should add to do Item in given toDo", function() {
    it("It should remove toDoItem in given toDo", function() {
      user.addToDoList("Cricket", "play");
      user.addToDoItem("Cricket", "Play at 10am");
      user.addToDoItem("Cricket", "rest at 11am");
      user.removeToDoItem("Cricket", 2);
      let expected = {
        noOfItems: 2,
        title: 'Cricket',
        description: 'play',
        toDoItems: {
          '1': {
            toDoItem: 'Play at 10am',
            status: false
          }
        }
      }
      assert.deepEqual(user.getSpecificToDo("Cricket"), expected);
    });
  });

  describe("getSpecificToDoItem(title,toDoItemId) should remove to do lists", function() {
    it("It should remove given to do ", function() {
      user.addToDoList("Cricket", "play");
      user.addToDoItem("Cricket", "Play at 10am");
      user.addToDoItem("Cricket", "rest at 11am");
      let expected = {
        toDoItem: 'Play at 10am',
        status: false
      }
      assert.deepEqual(user.getSpecificToDoItem("Cricket", 1), expected);
    });
  });
});
