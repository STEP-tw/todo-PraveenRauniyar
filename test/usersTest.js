let chai = require('chai');
let assert = chai.assert;
process.env.COMMENT_STORE = "./testStore.json";
let User = require('../public/js/user.js');

describe("user", function() {
  beforeEach(() => {
    user = new User("Praveen");
  });
  describe("getAllToDoTitals() should give all to do lists", function() {
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
      user.addToDoList("App","createApp");
      let expected =  {
        "App": {
          "description": "createApp",
          noOfItems: 0,
          title: "App",
          toDoItems: {}
        }
      }
      assert.deepEqual(user.getAllToDo(),expected);
    });
    it("It should add multiple ToDo list", function() {
      user.addToDoList("App", "Create App")
      user.addToDoList("Cricket Tournament", "Arrangement of cricket tournament")
      assert.deepEqual(user.getAllToDoTitle(), ["App", "Cricket Tournament"]);
    });
  });

  describe("removeToDoList() should add to do lists", function() {
    it("It should remove given to do ", function() {
      user.addToDoList("App","createApp");
      user.removeToDoList("App")
      assert.deepEqual(user.getAllToDo(),{});
    });
    it("It should remove toDoList when it available either nothing to do", function() {
      user.removeToDoList("Cricket");
      assert.deepEqual(user.getAllToDo(),{});
    });
  });

});
