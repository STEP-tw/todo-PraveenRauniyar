let chai = require('chai');
let assert = chai.assert;

let User = require('../models/user.js');

describe("user", function () {
  beforeEach(() => {
    user = new User("Praveen",'1234');
  });

  describe("getAllToDoTitles()", function () {
    it("It should return initially empty list of title ", function () {
      assert.deepEqual(user.getAllToDoTitle(), []);
    });
    it("It should return list of all toDo titles after adding toDos ", function () {
      user.addToDoList("App", "Create App")
      user.addToDoList("Cricket Tournament", "Arrangement of cricket tournament")
      assert.deepEqual(user.getAllToDoTitle(), ["App", "Cricket Tournament"]);
    });
  });

  describe("addToDoList()", function () {
    it("It should add a new toDoList for the user", function () {
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
    it("It should add multiple ToDoLists for the user ", function () {
      user.addToDoList("App", "Create App")
      user.addToDoList("Cricket Tournament", "Arrangement of cricket tournament")
      assert.deepEqual(user.getAllToDoTitle(), ["App", "Cricket Tournament"]);
    });
  });

  describe("removeToDoList(title)", function () {
    it("It should remove given toDoList from user toDoLists", function () {
      user.addToDoList("App", "createApp");
      user.removeToDoList("App")
      assert.deepEqual(user.getAllToDo(), {});
    });
    it("It should return all todo list if given todo is not present", function () {
      user.addToDoList("App", "createApp");
      user.removeToDoList("Cricket")
      assert.deepEqual(user.getAllToDoTitle(), ["App"]);
    });
  });

  describe("editTitles(title,newTitle)", function () {
    it("It should remove given toDoList from user toDoLists", function () {
      user.addToDoList("App", "createApp");
      user.addToDoList("Cricket", "Tournament");
      console.log(user.getAllToDoTitle());
      user.editTitles("App","creatingApp");
      assert.notInclude(user.getAllToDoTitle(),"App");
      assert.include(user.getAllToDoTitle(),"creatingApp");
    });
  });

  describe("getSpecificToDo(title)", function () {
    it("It should return specific toDoList of user", function () {
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

  describe("getAllToDoItems(title)", function () {
    it("It should return all toDoItems of specific toDoList of user", function () {
      user.addToDoList("App", "createApp");
      user.addToDoItem("App", "Play at 10am");
      user.addToDoItem("App", "Play at 4pm");
      let expected = {
        1 :{"toDoItem":"Play at 10am",status :false},
        2 :{"toDoItem":"Play at 4pm",status :false}
      };
      assert.deepEqual(user.getAllToDoItems("App"), expected);
    });
  });

  describe("addToDoItem(title,toDoText)", function () {
    beforeEach(() => {
      user.addToDoList("App", "createApp");
      user.addToDoList("Cricket", "play");
    });
    it("It should add a toDoItem in given to do list of user", function () {
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

  describe("removeToDoItem(title,toDoId)", function () {
    it("It should remove toDoItem from given toDoList of user", function () {
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
  describe("editToDoItem(title,toDoId,newTodoText)", function () {
    it("It should remove toDoItem from given toDoList of user", function () {
      user.addToDoList("Cricket", "play");
      user.addToDoItem("Cricket", "Play at 10am");
      user.addToDoItem("Cricket", "rest at 11am");
      user.editToDoItem("Cricket", 2,"rest at 12am");
      assert.equal(user.getToDoItem("Cricket",2), "rest at 12am");
    });
  });

  describe("getSpecificToDoItem(title,toDoItemId)", function () {
    it("It should give specific toDoItem from specific toDoList of user ", function () {
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

  describe("getSpecificUsers()", function () {
    it("It should give specific toDoItem from specific toDoList of user ", function () {
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

  describe("markAsDone()", function () {
    it("is done should be true after mark As done of specific todo item ", function () {
      user.addToDoList("Cricket", "play");
      user.addToDoItem("Cricket", "Play at 10am");
      user.addToDoItem("Cricket", "rest at 11am");
      user.markAsDone("Cricket", 1);
      assert.isOk(user.isDone("Cricket", 1));
    });
  });

  describe("markAsNotDone()", function () {
    it("isDone() should be false after mark As done of specific todo item ", function () {
      user.addToDoList("Cricket", "play");
      user.addToDoItem("Cricket", "Play at 10am");
      user.addToDoItem("Cricket", "rest at 11am");
      user.markAsNotDone("Cricket", 1);
      assert.isNotOk(user.isDone("Cricket", 1));
    });
  });

  describe("isDone()", function () {
    it("isDone() should be initially false ", function () {
      user.addToDoList("Cricket", "play");
      user.addToDoItem("Cricket", "Play at 10am");
      user.addToDoItem("Cricket", "rest at 11am");
      assert.isNotOk(user.isDone("Cricket", 1));
    });
  });

  describe("getToDoItem()", function () {
    it("It should give todo item of specific id ", function () {
      user.addToDoList("Cricket", "play");
      user.addToDoItem("Cricket", "Play at 10am");
      user.addToDoItem("Cricket", "rest at 11am");
      assert.equal(user.getToDoItem("Cricket", 1),"Play at 10am");
      assert.equal(user.getToDoItem("Cricket", 2),"rest at 11am");
    });
  });
});
