const assert = require('chai').assert;
const Users = require('../models/users.js');
const User = require('../models/user.js');

const fs = require('fs');

describe('users', function() {
  describe('addUser()', function() {
    it('should add a new user with username and password', () => {
      let users = new Users({});
      users.addUser('Amit', '1234');
      users.addUser('praveen', '1234');
      assert.deepEqual({
        'Amit': new User('Amit', '1234'),
        "praveen": new User('praveen', '1234')
      }, users.getUsers());
    })
    it('should not add a new user with existing username', () => {
      let users = new Users({});
      users.addUser('praveen', '1234');
      users.addUser('praveen', '0000');
      assert.deepEqual({
        "praveen": new User('praveen', '1234')
      }, users.getUsers());
      assert.notDeepEqual({
        "praveen": new User('praveen', '0000')
      }, users.getUsers());
    });
  });

  describe('getSpecificUser(field,value)', function() {
    it('should give user data with user name', function() {
      let users = new Users({});
      let expected = new User('praveen', '1234');
      users.addUser('praveen', '1234');
      users.addUser("anju","234");
      assert.deepEqual(expected, users.getSpecificUser("userName", "praveen"));
    });
  });
});
