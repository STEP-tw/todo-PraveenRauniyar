let chai = require('chai');
let assert = chai.assert;
let app = require('../app/app.js').app;
let request = require("supertest");
let Users = require('../models/users.js');
const MockFileSystem = require('./mockFileSystem.js');

let sessionid;
let doesNotContain = (pattern) => {
  return (res) => {
    sessionid = (res.headers['set-cookie'][1].split("=")[1].split(";")[0]);
    let match = res.text.match(pattern);
    if (match) throw new Error(`'${res.text}' contains '${pattern}'`);
  }
};

let doesNotHaveCookies = (res) => {
  const keys = Object.keys(res.headers);
  let key = keys.find(k => k.match(/set-cookie/i));
  if (key) throw new Error(`Didnot expect Set-Cookie in header of ${keys}`);
};

describe('app', () => {
  beforeEach(() => {
    let mockfs = new MockFileSystem();
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
    it('responds with 404 for file not exist', done => {
      request(app)
        .get("/bad")
        .expect(404)
        .end(done)
    });
  });

  describe('GET /', () => {
    it('should display welcome page', done => {
      request(app)
        .get("/")
        .expect(200)
        .expect("content-Type", /html/)
        .expect(/userName/)
        .end(done)
    });
  });

  describe('GET /login.html', () => {
    it('serves the login page', done => {
      request(app)
        .get("/login")
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(/userName/)
        .expect(doesNotHaveCookies)
        .end(done);
    });
    it('serves the login page with message for a failed login', done => {
      request(app)
        .get("/login")
        .set("Set-Cookie", "message=login failed")
        .expect(200)
        .expect("Content-Type", /html/)
        .expect(/userName/)
        .expect(doesNotHaveCookies)
        .end(done)
    });
  });

  describe('POST /login', () => {
    it('redirects to home page by setting cookie sessionid', done => {
      request(app)
        .post("/login")
        .send('userName=praveen')
        .expect(302)
        .expect(doesNotContain(/login failed/))
        .expect("Location", '/homePage.html')
        .expect('set-cookie', /sessionid/)
        .end(done)
    });
    it('redirects to login page with message for invalid user', done => {
      request(app)
        .post("/login")
        .send('userName=pran')
        .expect(302)
        .expect("Location", '/login')
        .expect('set-cookie', /logInFailed=true/)
        .end(done)
    });
  });

  describe('Post /addToDo', function() {
    it('redirects to homepage.html with given data', done => {
      request(app)
        .post('/addToDo')
        .set('cookie', `sessionid=${sessionid}`)
        .send('title=tea&description=makingtea&toDoItem=sugar&toDoItem=water')
        .expect(302)
        .expect("Location", "/homePage.html")
        .end(done)
    });
  });

  describe('Post /addToDo', function() {
    it('redirects to homepage.html with given data if title has space', done => {
      request(app)
        .post('/addToDo')
        .set('cookie', `sessionid=${sessionid}`)
        .send('title=tea%20and%20Water&description=makingtea&toDoItem=sugar')
        .expect(302)
        .expect("Location", "/homePage.html")
        .end(done)
    });
  });

  describe("Get /todo", () => {
    it('should give todos of user ', done => {
      request(app)
        .get('/todolist')
        .set('cookie', `sessionid=${sessionid}`)
        .expect(200)
        .expect(/tea/)
        .expect(/tea and Water/)
        .end(done)
    })
  });


  describe("Get /todo", () => {
    it('should give todo of user ', done => {
      request(app)
        .get("/todo/tea")
        .set('cookie', `sessionid=${sessionid}`)
        .expect(200)
        .expect(/Title/)
        .expect(/Description/)
        .expect(/Add To Do Item/)
        .end(done)
    })
    it('should give todo when title has space', done => {
      request(app)
        .get("/todo/tea and Water")
        .set('cookie', `sessionid=${sessionid}`)
        .expect(200)
        .expect(/Title/)
        .expect(/Description/)
        .expect(/Add To Do Item/)
        .end(done)
    })
  });

  describe('changeStatus', function() {
    it('should change the status of given item after checked ', done => {
      request(app)
      .post('/changeStatus/tea')
      .set('cookie', `sessionid=${sessionid}`)
      .send("title=tea&id=1&status=true")
      .expect(200)
      .end(done)
    });
  });

  describe('addItem', function() {
    it('should add item', done => {
      request(app)
      .post("/addItem")
      .set('cookie', `sessionid=${sessionid}`)
      .send("title=tea&&toDoItem=sugar&toDoItem=water")
      .expect(200)
      .end(done)
    });
  });

  describe('Post /deleteItem', function() {
    it('should redirect to homePage and delete the given todo', function(done) {
      request(app)
      .post("/deleteItem/tea")
      .set('cookie', `sessionid=${sessionid}`)
      .send("id=1")
      .expect(200)
      .end(done)
      });
    });

  describe('Post /deleteTodo', function() {
    it('should redirect to homePage and delete the given todo', function(done) {
      request(app)
      .get("/delete/tea")
      .set('cookie', `sessionid=${sessionid}`)
      .expect(200)
      .expect("Location", "/homePage.html")
      .end(done)
      });
    });

  describe('GET /logout', () => {
    it('should set expiring cookies and redirect to login page ', done => {
      request(app)
      .get("/logout")
      .set('cookie', `sessionid=${sessionid}`)
      .expect(302)
      .expect("Location",'/login')
      .expect('set-cookie', /sessionid=0/)
      .expect('set-cookie',/loginFailed/)
      .end(done)
    });
  });
});
