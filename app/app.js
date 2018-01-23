let fs = require('fs');
const WebApp = require('./webapp');
const setContentType = require("./content_type.js").setContentType;
const timeStamp = require('./time.js').timeStamp;
const User = require('../models/user.js');
const Users = require('../models/users.js');
const Todo = require('../models/toDoList.js');

let app = WebApp.create();
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

let toS = o => JSON.stringify(o, null, 2);

let logRequest = (req, res) => {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toString(req.headers)}`,
    `COOKIES=> ${toString(req.cookies)}`,
    `BODY=> ${toString(req.body)}`, ''
  ].join('\n');
  app.fs.appendFile('request.log', text, () => {});
};

const loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = users.getSpecificUser('sessionid', sessionid);
  if (sessionid && user) {
    user.__proto__ = new User().__proto__;
    req.user = user;
  };
};

const redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/login']) && req.user) res.redirect('/homePage.html');
};

const getLoginPage = function(req, res) {
  if (req.cookies.logInFailed)
    res.write('<p>logIn Failed</p>');
  let filePath = "./public/login.html";
  let loginPageContent = readFile(filePath, "utf8");
  res.write(loginPageContent);
};

const serveLogin = function(req, res) {
  res.setHeader('Content-type', "text/html");
  getLoginPage(req, res);
  res.end();
};

const setHeaderAndRedirect = function(res, headers, redirectPath) {
  res.setHeader("Set-Cookie", headers);
  res.redirect(redirectPath);
};

const postLoginPage = function(req, res) {
  let user = users.getSpecificUser("userName", req.body.userName);
  if (!user) {
    setHeaderAndRedirect(res, `logInFailed=true`, '/login')
    return;
  };
  let sessionid = new Date().getTime();
  setHeaderAndRedirect(res, [`sessionid=${sessionid}`, `logInFailed=false;Max-Age=5`], '/homePage.html');
  user.sessionid = sessionid;
  users.users[user.userName] = user;
  writeFile(toS(users.users));
};

const serveLogout = function(req, res) {
  setHeaderAndRedirect(res, [`loginFailed=false;Max-Age=5`, `sessionid=0;Max-Age=5`], '/login');
  writeFile(toS(users.users));
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
    let fileContents = readFile(filePath)
    res.setHeader('Content-type', setContentType(filePath));
    res.write(fileContents);
    res.end();
  } else {
    responseError(res);
  };
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


// const toFormInput = function(content, item) {
//   return `<input type ="text" name = "item"
//   value = ${item.toDoItem}><br/>`;
// };

const toHtml = function(content, item, itemid) {
  let checked = "";
  if(item.status){
    checked = "checked";
  }
  return `${itemid}. <big>${item.toDoItem}</big>
    &nbsp&nbsp<input type = "checkbox" ${checked} id = "${itemid}"
   onclick = "changeStatus(event)"/><br/>`;
};

const getAllToDoInHtml = function(content, todo, toFormat) {
  content = content.replace('TITLE', `${todo.title}`);
  content = content.replace('DESCRIPTION', `${todo.description}`);
  let allTodoItem = Object.values(todo.toDoItems || {});
  let itemid = 0;
  let itemsInHtmlForm = '';
  allTodoItem.forEach((item) => {
    itemsInHtmlForm += toFormat(itemsInHtmlForm, item, ++itemid);
  })
  content = content.replace("ITEMS", itemsInHtmlForm);
  return content;
};

const serveTodoFile = function(req, res) {
  if (req.url.startsWith('/todo--')) {
    let url = req.url.slice(7);
    while (url.includes('%20')) {
      url = url.replace('%20', ' ');
    };
    let todo = req.user.allToDo[url];
    let content = readFile('./public/viewTodo.html', 'utf8');
    res.write(getAllToDoInHtml(content, todo, toHtml));
    res.end();
  }
};
const deleteTodo = function(req, res) {
  req.user.removeToDoList(req.body.title);
  users.users[req.user.userName] = req.user;
  writeFile(toS(users.users));
  res.setHeader('location', '/homePage.html');
  res.end();
};

// const editTodo = function(req, res) {
//   if (req.url.startsWith('/editTodo')) {
//     let content = readFile('./public/edit_todo.html', 'utf8');
//     let title = req.url.slice(9);
//     let todo = req.user.getSpecificToDo(title);
//     res.write(getAllToDoInHtml(content, todo, toHtml));
//     res.end();
//   }
// }

const changeStatus = function (req,res) {
  let todo = req.user.getSpecificToDo(req.body.title);
  todo.__proto__ = new Todo().__proto__;
  if(req.body.status == 'true'){
    todo.markAsDone(req.body.id);
  } else{
    todo.markAsNotDone(req.body.id);
  }
  res.write("hello");
  users[req.user.userName] = req.user;
  writeFile(toS(users.users));
  res.end();
}

app.use(logRequest);
app.use(loadUser);
app.use(serveTodoFile);
app.use(redirectLoggedInUserToHome);
// app.use(editTodo);
app.get('/login', serveLogin);
app.get('/todo', serveListOfTodos);
app.post('/login', postLoginPage);
app.post('/changeStatus', changeStatus);
app.post('/addToDo', postToDoPage);
app.get('/logout', serveLogout);
app.postUse(serverStaticFiles);
app.post("/deleteTodo", deleteTodo);
exports.app = app;
