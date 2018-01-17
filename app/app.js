let fs = require('fs');
const WebApp = require('./webapp');
const setContentType = require("./content-Type.js").setContentType;
const registered_users = require("./registeredUser.js").registered_users;
const timeStamp = require('./time.js').timeStamp;
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

let loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u => u.sessionid == sessionid);
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

const serveLogin = function (req,res) {
  if (req.user) {
    res.redirect('/homePage.html');
    return;
  };
  res.setHeader('Content-type', "text/html");
  getLoginPage(req, res);
  res.end();
};

const postLoginPage = function(req, res) {
  let user = registered_users.find(u => u.userName == req.body.userName);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.redirect('/login');
    return;
  };
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/homePage.html');
};

const serveLogout = function (req, res) {
  res.setHeader('Set-Cookie', [`loginFailed=false,Expires=${new Date(1).toUTCString()}`, `sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
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

const serverStaticFiles = function (req, res) {
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

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.get('/login',serveLogin)
app.post('/login', postLoginPage);
app.get('/logout', serveLogout)
app.postUse(serverStaticFiles)

exports.app = app;
