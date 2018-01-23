let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app/app.js').app;
let th = require('./testHelper.js');
let Users = require('../models/users.js');
const MockFileSystem = require('../app/mockFileSystem.js');

let sessionid;

describe('app', () => {
  let mockfs;
  beforeEach(() => {
    mockfs = new MockFileSystem();
    mockfs.addFile('./public/welcomePage.html', 'Welcome to the To Do App');
    mockfs.addFile('./public/login.html', 'userName');
    mockfs.addFile('./data/users.JSON', `{"praveen": {
      "userName": "praveen",
      "password": "0000",
      "allToDo": {}}`);
    mockfs.addFile('./public/viewTodo.html', 'Title  Description Add To Do Item')
    app.fs = mockfs;
  });
  describe('GET /bad', () => {
    it('responds with 404', done => {
      request(app, {
        method: 'GET',
        url: '/bad'
      }, (res) => {
        assert.equal(res.statusCode, 404);
        done();
      });
    });
  });

  describe('GET /', () => {
    it('should display welcome page', done => {
      request(app, {
        method: 'GET',
        url: '/'
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'Welcome to the To Do App');
        done();
      });
    });
  });

  describe('GET /login.html', () => {
    it('serves the login page', done => {
      request(app, {
        method: 'GET',
        url: '/login'
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'userName');
        th.body_does_not_contain(res, 'logIn Failed');
        th.should_not_have_cookie(res, 'message');
        done();
      });
    });
    it('serves the login page with message for a failed login', done => {
      request(app, {
        method: 'GET',
        url: '/login',
        headers: {
          'cookie': 'message=login failed'
        }
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'userName');
        th.should_not_have_cookie(res, 'message');
        done();
      });
    });
  });

  describe('POST /login', () => {
    it('redirects to home page by setting cookie sessionid', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: 'userName=praveen'
      }, res => {
        sessionid = res.headers['Set-Cookie'][0].split('=')[1];
        th.should_be_redirected_to(res, '/homePage.html');
        th.should_have_expiring_cookie(res, 'logInFailed', 'false');
        done();
      });
    });
    it('redirects to login page with message for invalid user', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: 'userName=Amit'
      }, res => {
        th.should_be_redirected_to(res, '/login');
        th.should_have_cookie(res, 'logInFailed', 'true');
        done();
      });
    });
  });

  describe('Post /addToDo', function() {
    it('redirects to homepage.html with given data', done => {
      request(app, {
        method: 'POST',
        url: '/addToDo',
        headers: {
          'cookie': `sessionid=${sessionid}`
        },
        body: 'title=tea&description=makingtea&toDoItem=sugar&toDoItem=water'
      }, res => {
        th.should_be_redirected_to(res, '/homePage.html');
        done();
      });
    });
  });

  describe('Post /addToDo', function() {
    it('redirects to homepage.html with given data if title has space', done => {
      request(app, {
        method: 'POST',
        url: '/addToDo',
        headers: {
          'cookie': `sessionid=${sessionid}`
        },
        body: 'title=tea%20and%20Water&description=makingtea&toDoItem=sugar'
      }, res => {
        th.should_be_redirected_to(res, '/homePage.html');
        done();
      });
    });
  });

  describe("Get /todo", () => {
    it('should give todos of user ', done => {
      request(app, {
        method: 'GET',
        url: '/todo',
        headers: {
          'cookie': `sessionid=${sessionid}`
        }
      }, res => {
        th.body_contains(res, 'tea');
        th.body_contains(res, 'tea and Water');
        done();
      });
    })
  });


  describe("Get /todo--tea", () => {
    it('should give todo of user ', done => {
      request(app, {
        method: 'GET',
        url: '/todo--tea',
        headers: {
          'cookie': `sessionid=${sessionid}`
        }
      }, res => {
        th.body_contains(res, "Title");
        th.body_contains(res, "Description");
        th.body_contains(res, "Add To Do Item");
        done();
      });
    })
      it('should give todo when title has space', done => {
        request(app, {
          method: 'GET',
          url: '/todo--tea%20and%20Water',
          headers: {
            'cookie': `sessionid=${sessionid}`
          }
        }, res => {
          th.body_contains(res, "Title");
          th.body_contains(res, "Description");
          th.body_contains(res, "Add To Do Item");
          done();
        });
    })
  });
  describe('changeStatus', function() {
    it('should change the status of given item after checked ', done => {
      request(app, {
        method: 'POST',
        url: '/todo--tea',
        headers: {
          'cookie': `sessionid=${sessionid}`
        },
        body:"title=tea&id=1&status=true"
      }, res => {
        th.status_is_ok(res);
        done();
      });
    });
  });
  describe('Post /deleteTodo', function() {
    it('should redirect to homePage and delete the given todo', function(done) {
      request(app, {
        method: 'POST',
        url: "/deleteTodo",
        headers: {
          'cookie': `sessionid=${sessionid}`
        },
        body: "title=tea"
      }, res => {
        th.status_is_ok(res);
        assert.equal(res.headers.location, '/homePage.html');
        done();
      });
    });
  })
  describe('GET /logout', () => {
    it('should set expiring cookies and redirect to login page ', done => {
      request(app, {
        method: 'GET',
        url: '/logout',
        headers: {
          'cookie': `sessionid=${sessionid}`
        }
      }, res => {
        th.should_be_redirected_to(res, '/login');
        th.should_have_expiring_cookie(res, 'loginFailed', 'false');
        th.should_have_expiring_cookie(res, 'sessionid', '0');
        done();
      });
    });
  });
});
