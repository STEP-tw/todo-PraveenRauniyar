const assert = require('chai').assert;
const Users = require('../models/users.js');
const User = require('../models/user.js');

describe('users', function() {
  describe('addUser()', function() {
    it('should add a new user with username and password',()=>{
      let expected = new User('anju','1234');
      let users = new Users();
      users.addUser('anju','1234');
      assert.deepEqual({'anju':expected},users.getUsers());
    })
    it('should not add a new user with existing username',()=>{
      let expected = new User('anju','1234');
      let users = new Users();
      assert.deepEqual({'anju':expected},users.getUsers());
      users.addUser('anju','0000');
      assert.deepEqual({'anju':expected},users.getUsers());
      assert.notDeepEqual({'anju':new User('anju','0000')},users.getUsers());
    })
  });

  describe
});
