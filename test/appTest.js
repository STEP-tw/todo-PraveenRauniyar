let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('../app/app.js').app;
let th = require('./testHelper.js');
let Users = require('../models/users.js');

let sessionid;

describe('app', () => {
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
        body: 'title=tea&discription=makingtea&toDoItem=sugar&toDoItem=water'
      }, res => {
        th.should_be_redirected_to(res, '/homePage.html');
        done();
      });
    });
  });

  describe.skip("Get /todo", () => {
    it('should give todos of user ', done => {
      let users = new Users("./data");
      request(app, {
        method: 'GET',
        url: '/todo',
        headers: {
          'cookie': `sessionid=${sessionid}`
        }
      }, res => {
        console.log(users);
        th.body_contains(res,'tea');
        done();
      });
    })
  });


  describe("Get /toDo.html", () => {
    it('should give todos of user ', done => {
      let users = new Users("./data");
      request(app, {
        method: 'GET',
        url: '/toDo.html',
        headers: {
          'cookie': `sessionid=${sessionid}`
        }
      }, res => {
        th.body_contains(res, "title");
        th.body_contains(res, "Description");
        th.body_contains(res, "Add To Do Item");
        done();
      });
    })
  });
  describe.skip('Post /deleteTodo', function() {
    it('should redirect to homePage and delete the given todo', function(done) {
      request(app, {
        method: 'POST',
        url: "/deleteTodo",
        headers: {
          'cookie': `sessionid=${sessionid}`
        },
        body: "title=tytuijokp"
      }, res => {
        console.log(sessionid);
        th.should_be_redirected_to(res, '/homePage.html');
        done();
      });
    });
    it('now the list of todos should not have deleted todo', function(done) {
      request(app, {
        method: 'GET',
        url: "/todo",
        headers: {
          'cookie': `sessionid=${sessionid}`
        },
        body: "title=anjum"
      }, res => {
        th.body_does_not_contain(res, "anjum");
      });
      done();
    });
  })
  describe('GET logout', () => {
    it('should set expiring cookies and redirect to login page ', done => {
      request(app, {
        method: 'GET',
        url: '/logout'
      }, res => {
        th.should_be_redirected_to(res, '/login');
        th.should_have_expiring_cookie(res, 'loginFailed', 'false');
        th.should_have_expiring_cookie(res, 'sessionid', '0');
        done();
      });
    });
  });
});
