const assert = require('chai').assert;
const Users = require('../models/users.js');
const User = require('../models/user.js');

const fs = require('fs');

describe('users', function() {
  fs.mkdirSync('./test/data');
  describe('addUser()', function() {
    it('should add a new user with username and password', () => {
      let expected = new User('anju', '1234');
      let users = new Users('./test/data');
      users.addUser('anju', '1234');
      assert.deepEqual({
        'anju': expected
      }, users.getUsers());
    })
    it('should not add a new user with existing username', () => {
      let expected = new User('anju', '1234');
      let users = new Users('./test/data');
      assert.deepEqual({
        'anju': expected
      }, users.getUsers());
      users.addUser('anju', '0000');
      assert.deepEqual({
        'anju': expected
      }, users.getUsers());
      assert.notDeepEqual({
        'anju': new User('anju', '0000')
      }, users.getUsers());
    })
    it('should add another user with new username', () => {
      let expected = new User('praveen', '1234');
      let users = new Users('./test/data');
      users.addUser('praveen', '1234');
      assert.deepEqual({
        'praveen': expected,
        anju: new User('anju', '1234')
      }, users.getUsers());
    })
  });
  describe('getSpecificUser(field,value)', function() {
    it('should give user data with user name', function() {
      let expected = new User('praveen', '1234');
      users.addUser('praveen', '1234');
      assert.deepEqual({
        'praveen': expected,
        anju: new User('anju', '1234')
      }, users.getSpecificUser("userName","praveen"));
    });
  });
});
