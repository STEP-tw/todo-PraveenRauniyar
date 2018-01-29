let fs = require('fs');
const express = require('express');
const toHtml =require("./toHtml.js").toHtml;
const getAllToDoInHtml =require("./toHtml.js").getAllToDoInHtml;
const querystring = require('querystring');
const getCookies = require('./parseCookies.js').getCookies;
const setContentType = require("./content_type.js").setContentType;
const timeStamp = require('./time.js').timeStamp;
const User = require('../models/user.js');
const Users = require('../models/users.js');
const Todo = require('../models/toDoList.js');

let app = express();
app.fs = fs;

const writeFile =function (content) {
  app.fs.writeFileSync('./data/users.JSON',content);
};

const readFile = function (path,encoding) {
  return app.fs.readFileSync(path , encoding);
};

const getUsers = function() {
  let userData = readFile('./data/users.JSON', 'utf8');
  return new Users(JSON.parse(userData));
}

let users = getUsers();

const toS = o => JSON.stringify(o, null, 2);

const logRequest = (req, res,next) => {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toString(req.headers)}`,
    `COOKIES=> ${toString(req.cookies)}`,
    `BODY=> ${toString(req.body)}`, ''
  ].join('\n');
  app.fs.appendFileSync('request.log', text);
  next();
};

const loadUser = (req, res,next) => {
  let sessionid = req.cookies && req.cookies.sessionid;
  let user = users.getSpecificUser('sessionid', sessionid);
  if (sessionid && user) {
    user.__proto__ = new User().__proto__;
    req.user = user;
  };
  next();
};

const redirectLoggedInUserToHome = (req, res,next) => {
  let redirectToHomePageUrls = ['/login',"/","homePage.html"]
  if (redirectToHomePageUrls.includes(req.url) && req.user) res.redirect('/homePage.html');
  else next();
};

const getLoginPage = function(req,res) {
  if (req.cookies && req.cookies.logInFailed){
    res.write('logIn Failed');
  }
  let filePath = "./public/login.html";
  let loginPageContent = readFile(filePath, "utf8");
  res.write(loginPageContent);
};

const serveLogin = function(req, res) {
  res.setHeader('Content-type', "text/html");
  getLoginPage(req, res);
  res.end();
};

const handleIfNotUser = function (res) {
  res.cookie('logInFailed','true');
  res.redirect('/login');
  return;
}

const postLoginPage = function(req,res) {
  let user = users.getSpecificUser("userName", req.body.userName);
  if (!user) {
    return handleIfNotUser(res);
  };
  user.sessionid = new Date().getTime();
  res.cookie('logInFailed','false',{maxAge: 5,httpOnly: false,signed: false});
  res.cookie('sessionid',user.sessionid);
  res.redirect('/homePage.html');
  users.users[user.userName] = user;
  writeFile(toS(users.users));
};

const serveLogout = function(req, res) {
  res.cookie('loginFailed','false',{ maxAge: 5});
  res.cookie('sessionid','0',{maxAge:5})
  res.redirect("/login");
  writeFile(toS(users.users));
};

const addToDo = function(title, description, toDoItem, user) {
  user.addToDoList(title, description);
  toDoItem.forEach(function(item) {
    user.addToDoItem(title, item);
  });
  users.users[user.userName] = user;
  writeFile(toS(users.users));
};

const postToDoPage = function(req, res) {
  let title = req.body.title;
  let description = req.body.description;
  let toDoItem = req.body.toDoItem || [];
  if (typeof(toDoItem) == 'string') {
    toDoItem = [toDoItem];
  }
  addToDo(title, description, toDoItem, req.user);
  res.redirect('/homePage.html');
};

const serveListOfTodos = function(req, res) {
  let listOfTodos = req.user.getAllToDoTitle();
  res.write(listOfTodos.toString());
  res.end();
}

const serveTodoFile = function(req,res) {
  let content = readFile('./public/viewTodo.html', 'utf8');
  let title = req.params.title;
  while (title.includes('%20')){
    title = title.replace('%20', ' ');
  };
  let todo = req.user.allToDo[title];
  content = getAllToDoInHtml(content, todo, toHtml);
  res.send(content);
};

const deleteTodo = function(req,res) {
  req.user.removeToDoList(req.params.title);
  users.users[req.user.userName] = req.user;
  writeFile(toS(users.users));
  res.setHeader('location', '/homePage.html');
  res.end();
};

const changeStatus = function (req,res) {
  let todo = req.user.getSpecificToDo(req.params.title);
  todo.__proto__ = new Todo().__proto__;
  if(eval(req.body.status)){
    todo.markAsDone(req.body.id);
  } else{
    todo.markAsNotDone(req.body.id);
  }
  users[req.user.userName] = req.user;
  writeFile(toS(users.users));
  res.end()
}

const parseBody = function (req,res,next) {
  let content = "";
  req.on('data', data => content += data.toString());
  req.on('end', () => {
    req.body = querystring.parse(content);
    next();
  });
};

const addItem = function (req, res) {
  let todo = req.user.getSpecificToDo(req.body.title);
  todo.__proto__ = new Todo().__proto__;
  todo.addToDoItem(req.body.item);
  users[req.user.userName] = req.user;
  writeFile(toS(users.users));
  res.end();
};

const deleteItem = function (req, res) {
  let todo = req.user.getSpecificToDo(req.params.title);
  todo.__proto__ = new Todo().__proto__;
  todo.removeToDoItem(req.body.id);
  users[req.user.userName] = req.user;
  writeFile(toS(users.users));
  res.end();
};

// ==============================================================

app.use(getCookies);
app.use(logRequest);
app.use(loadUser);
app.use(parseBody);
app.use(redirectLoggedInUserToHome);
app.get('/',serveLogin);
app.post('/addItem',addItem);
app.use(express.static('public'));
app.get('/login', serveLogin);
app.post('/login',postLoginPage);
app.get('/todolist', serveListOfTodos);
app.post('/changeStatus/:title', changeStatus);
app.post('/deleteItem/:title', deleteItem);
app.post('/addToDo', postToDoPage);
app.get('/logout', serveLogout);
app.get('/todo/:title',serveTodoFile);
app.get("/delete/:title", deleteTodo);
exports.app = app;
