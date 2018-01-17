let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let User = require('../public/js/user.js');

describe("user", function() {
  beforeEach(() => {
    user = new User("Praveen");
  });
  describe("getAllToDoTitles()", function() {
    it("It should return initially empty list of title ", function() {
      assert.deepEqual(user.getAllToDoTitle(), []);
    });
    it("It should return list of all toDo titles after adding toDos ", function() {
      user.addToDoList("App", "Create App")
      user.addToDoList("Cricket Tournament", "Arrangement of cricket tournament")
      assert.deepEqual(user.getAllToDoTitle(), ["App", "Cricket Tournament"]);
    });
  });

  describe("addToDoList()", function() {
    it("It should add a new toDoList for the user", function() {
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
    it("It should add multiple ToDoLists for the user ", function() {
      user.addToDoList("App", "Create App")
      user.addToDoList("Cricket Tournament", "Arrangement of cricket tournament")
      assert.deepEqual(user.getAllToDoTitle(), ["App", "Cricket Tournament"]);
    });
  });

  describe("removeToDoList(title)", function() {
    it("It should remove given toDoList from user toDoLists", function() {
      user.addToDoList("App", "createApp");
      user.removeToDoList("App")
      assert.deepEqual(user.getAllToDo(), {});
    });
  });

  describe("getSpecificToDo(title)", function() {
    it("It should return specific toDoList of user", function() {
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

  describe("addToDoItem(title,toDoText)", function() {
    beforeEach(() => {
      user.addToDoList("App", "createApp");
      user.addToDoList("Cricket", "play");
    });
    it("It should add a toDoItem in given to do list of user", function() {
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
      user.addToDoItem("App", "create App");
      assert.deepEqual(user.getSpecificToDo("Cricket"), expected);
    });
  });

  describe("removeToDoItem(title,toDoId)", function() {
    it("It should remove toDoItem from given toDoList of user", function() {
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

  describe("getSpecificToDoItem(title,toDoItemId)", function() {
    it("It should give specific toDoItem from specific toDoList of user ", function() {
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
