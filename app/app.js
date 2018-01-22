let fs = require('fs');
const WebApp = require('./webapp');
const setContentType = require("./content_type.js").setContentType;
const timeStamp = require('./time.js').timeStamp;
const User = require('../models/user.js');
const Users = require('../models/users.js');

let app = WebApp.create();
app.fs = fs;


const getUsers = function(){
  let userData = app.fs.readFileSync('./data/users.JSON','utf8');
  return new Users(JSON.parse(userData));
}

let users = getUsers();
let toS = o => JSON.stringify(o, null, 2);
let logRequest = (req, res) => {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toString(req.headers)}`,
    `COOKIES=> ${toString(req.cookies)}`,
    `BODY=> ${toString(req.body)}`, ''
  ].join('\n');
  fs.appendFile('request.log', text, () => {});
};

const getUser = function(field,value){
  let user = users.getSpecificUser(field,value);
  return user;
}

let loadUser = (req,res) => {
  let sessionid = req.cookies.sessionid;
  let user = users.getSpecificUser('sessionid',sessionid);
  if (sessionid && user) {
    user.__proto__ = new User().__proto__;
    req.user = user;
  };
};

let redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/login']) && req.user) res.redirect('homePage.html');
};

let redirectLoggedOutUserToLogin = (req, res) => {
  if (req.urlIsOneOf(['/logout']) && !req.user) res.redirect('/login');
};

const getLoginPage = function(req, res) {
  if (req.cookies.logInFailed)
    res.write('<p>logIn Failed</p>');
  let filePath = "./public/login.html";
  let loginPageContent = app.fs.readFileSync(filePath, "utf8");
  res.write(loginPageContent);
};

const serveLogin = function(req, res) {
  if (req.user) {
    res.redirect('/homePage.html');
    return;
  };
  res.setHeader('Content-type', "text/html");
  getLoginPage.call(this,req, res);
  res.end();
};

const postLoginPage = function(req, res) {
  let user = getUser("userName",req.body.userName);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.redirect('/login');
    return;
  };
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', [`sessionid=${sessionid}`,`logInFailed=false;Max-Age=5`]);
  user.sessionid = sessionid;
  users.users[user.userName] = user;
  app.fs.writeFileSync('./data/users.JSON',toS(users.users));
  res.redirect('/homePage.html');
};

const serveLogout = function(req,res) {
  res.setHeader('Set-Cookie', [`loginFailed=false;Max-Age=5`, `sessionid=0;Max-Age=5`]);
  res.redirect('/login');
  console.log();
  app.fs.writeFileSync('./data/users.JSON',toS(users.users));
};

const getFilePath = function(req) {
  if (req.url == "/") {
    return `./public/welcomePage.html`;
  };
  return `./public${req.url}`;
};

const responseError = function(res) {
  res.statusCode = 404;
  res.write('file not found');
  res.end();
};

const serverStaticFiles = function(req, res) {
  let filePath = getFilePath(req);
  if (app.fs.existsSync(filePath)) {
    let fileContents = app.fs.readFileSync(filePath)
    res.setHeader('Content-type', setContentType(filePath));
    res.write(fileContents);
    res.end();
  } else {
    responseError(res);
  };
};

const addToDo = function (title,description,toDoItem,user) {
  user.addToDoList(title,description);
  toDoItem.forEach(function (item) {
    user.addToDoItem(title,item);
  });
  users.users[user.userName] = user;
  let todoPath = `./data/users.JSON`;
  app.fs.writeFileSync(todoPath,toS(users.users));
};

const postToDoPage = function(req, res) {
  let title = req.body.title;
  let description = req.body.description;
  let toDoItem = req.body.toDoItem || [];
  if(typeof(toDoItem)=='string'){
    toDoItem = [toDoItem];
  }
  addToDo(title,description,toDoItem,req.user);
  res.redirect('/homePage.html');
};

const serveListOfTodos = function (req, res) {
  let listOfTodos = req.user.getAllToDoTitle();
  res.write(listOfTodos.toString());
  res.end();
}


const toHtml = function (content,item) {
  return `<h3>${item.toDoItem}</h3>`;
};

const toFormInput = function(content,item){
  return `<input type ="text" name = "item" value = ${item.toDoItem}><br/>`;
}

const getAllToDoInHtml = function (todo,toFormat) {
  let content = app.fs.readFileSync('./public/viewTodo.html','utf8');
  let description =  todo.description;
  content = content.replace('TITLE',`${todo.title}`);
  content = content.replace('DESCRIPTION',`${description}`);
  let allTodoItem = Object.values(todo.toDoItems);
  allTodoItem = allTodoItem.reduce(toFormat,'');
  content = content.replace("ITEMS",allTodoItem);
  return content;
};

const serveTodoFile = function(req,res){
  if(req.url.startsWith('/todo--')){
    let url = req.url.slice(7);
    while(url.includes('%20')){
      url = url.replace('%20',' ');
    };
    let todo = req.user.allToDo[url];
    res.write(getAllToDoInHtml(todo,toHtml));
    res.end();
  }
};
const deleteTodo = function (req,res) {
  req.user.removeToDoList(req.body.title);
  users.users[req.user.userName] = req.user;
  let usersData = JSON.stringify(users.users,null,2);
  app.fs.writeFileSync("./data/users.JSON",usersData);
  res.setHeader('location','/homePage.html');
  res.end();
};

const editTodo = function(req,res){
  if(req.url.startsWith('/editTodo')){
    let content = app.fs.readFileSync('./public/edit_todo.html','utf8');
    let title = req.url.slice(9);
    let todo = req.user.getSpecificToDo(title);
    res.write(getAllToDoInHtml(content,todo,toFormInput));
    res.end();
  }
}


app.use(logRequest);
app.use(loadUser);
app.use(serveTodoFile);
app.use(redirectLoggedInUserToHome);
app.use(editTodo);
app.get('/login', serveLogin);
app.get('/todo', serveListOfTodos);
app.post('/login', postLoginPage);
app.post('/addToDo', postToDoPage);
app.get('/logout', serveLogout);
app.postUse(serverStaticFiles);
app.post("/deleteTodo",deleteTodo);
exports.app = app;
