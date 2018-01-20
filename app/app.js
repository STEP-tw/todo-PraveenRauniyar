let fs = require('fs');
const WebApp = require('./webapp');
const setContentType = require("./content_type.js").setContentType;
const timeStamp = require('./time.js').timeStamp;
const User = require('../models/user.js');
const Users = require('../models/users.js');
let toString = o => JSON.stringify(o, null, 2);

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
  let users = new Users("./data");
  let user = users.getSpecificUser(field,value);
  user.__proto__ = new User().__proto__;
  return user;
}

let loadUser = (req, res) => {
  let users = new Users("./data");
  let sessionid = req.cookies.sessionid;
  let user = users.getSpecificUser("sessionid",sessionid);
  if (sessionid && user) {
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
  let loginPageContent = fs.readFileSync(filePath, "utf8")
  res.write(loginPageContent);
};

const serveLogin = function(req, res) {
  if (req.user) {
    res.redirect('/homePage.html');
    return;
  };
  res.setHeader('Content-type', "text/html");
  getLoginPage(req, res);
  res.end();
};

const postLoginPage = function(req, res) {
  let users = new Users("./data");
  let user = users.getSpecificUser("userName",req.body.userName);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.redirect('/login');
    return;
  };
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', [`sessionid=${sessionid}`,`logInFailed=false;Max-Age=5`]);
  user.sessionid = sessionid;
  users.updateUser(user);
  res.redirect('/homePage.html');
};

const serveLogout = function(req,res) {
  res.setHeader('Set-Cookie', [`loginFailed=false;Max-Age=5`, `sessionid=0;Max-Age=5`]);
  res.redirect('/login');
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
  if (fs.existsSync(filePath)) {
    let fileContents = fs.readFileSync(filePath)
    res.setHeader('Content-type', setContentType(filePath));
    res.write(fileContents);
    res.end();
  } else {
    responseError(res);
  };
};

const addToDo = function (title,description,toDoItem,user) {
  let users = new Users('./data');
  user.addToDoList(title,description);
  toDoItem.forEach(function (item) {
    user.addToDoItem(title,item);
  });
  let toDoData = JSON.stringify(user,null,2);
  let todoPath = `./data/${user.userName}.JSON`;
  fs.writeFileSync(todoPath,toDoData);
};

const postToDoPage = function(req, res) {
  let title = req.body.Title;
  let description = req.body.description;
  let toDoItem = req.body.toDoItem || [];
  if(typeof(toDoItem)=='string'){
    toDoItem = [toDoItem];
  }
  let user = fs.readFileSync(`./data/${req.user.userName}.JSON`,'utf8');
  user = JSON.parse(user);
  user.__proto__= new User().__proto__;
  addToDo(title,description,toDoItem,user);
  res.redirect('/homePage.html');
};

const serveListOfTodos = function (req, res) {
  let user = fs.readFileSync(`./data/${req.user.userName}.JSON`,'utf8');
  user = JSON.parse(user);
  user.__proto__ = new User().__proto__;
  let listOfTodos = user.getAllToDoTitle();
  res.write(listOfTodos.toString());
  res.end();
}


const toHtml = function (item) {
  return `<h3>${item.toDoItem}</h3>`;
};

const getAllToDoInHtml = function (todo) {
  let content = fs.readFileSync('./public/viewTodo.html','utf8');
  let description =  todo.description;
  content = content.replace('TITLE',`${todo.title}`);
  content = content.replace('DESCRIPTION',`${description}`);
  let allTodoItem = Object.values(todo.toDoItems);
  allTodoItem = allTodoItem.map(toHtml).join('');
  content = content.replace("ITEMS",allTodoItem);
  return content;
};

const serveTodoFile = function(req,res){
  if(req.url.startsWith('/todo--')){
    let path = `./data/${req.user.userName}.JSON`;
    user = fs.readFileSync(path,'utf8');
    user = JSON.parse(user);
    let url = req.url.slice(7);
    while(url.includes('%20')){
      url = url.replace('%20',' ');
    };
    let todo = user.allToDo[url];
    res.write(getAllToDoInHtml(todo));
    res.end();
  }
};
const deleteTodo = function (req,res) {
  let user = fs.readFileSync("./data/"+req.user.userName+".JSON",'utf8');
  user = JSON.parse(user);
  user.__proto__ =new User().__proto__;
  user.removeToDoList(req.body.title);
  user = JSON.stringify(user,null,2);
  fs.writeFileSync("./data/"+req.user.userName+".JSON",user);
  res.setHeader('location','/homePage.html');
  res.end();
};

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(serveTodoFile);
app.use(redirectLoggedInUserToHome);
app.get('/login', serveLogin);
app.get('/todo', serveListOfTodos);
app.post('/login', postLoginPage);
app.post('/addToDo', postToDoPage);
app.get('/logout', serveLogout)
app.postUse(serverStaticFiles);
app.post("/deleteTodo",deleteTodo);

exports.app = app;
