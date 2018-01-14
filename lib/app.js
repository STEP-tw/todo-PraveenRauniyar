let fs = require('fs');
const WebApp = require('../webapp');
const setContentType = require("./serverUtils.js").setContentType;
const loadUser = require("./serverUtils.js").loadUser;
const logRequest = require("./serverUtils.js").logRequest;
const registered_users = require("./registeredUser.js").registered_users;

let toString = o => JSON.stringify(o, null, 2);

let redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/login']) && req.user) res.redirect('homePage.html');
};

let redirectLoggedOutUserToLogin = (req, res) => {
  if (req.urlIsOneOf(['/logout']) && !req.user) res.redirect('/login');
};

let app = WebApp.create();
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);

const getLoginPage = function(req,res) {
  if (req.cookies.logInFailed)
  res.write('<p>logIn Failed</p>');
  let filePath = "./public/login.html";
  let loginPageContent = fs.readFileSync(filePath, "utf8")
  res.write(loginPageContent);
};

app.get('/login', (req, res) => {
  if(req.user) {
    res.redirect('/homePage.html');
    return;
  }
  res.setHeader('Content-type', "text/html");
  getLoginPage(req,res);
  res.end();
});

app.post('/login', (req, res) => {
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/homePage.html');
});

app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login');
});

const getFilePath = function (req) {
  if (req.url == "/") {
    return `./public/welcomePage.html`;
  };
  return `./public${req.url}`;
};

app.postuse((req, res) => {
  let filePath = getFilePath(req);
  if (fs.existsSync(filePath)) {
    let fileContents = fs.readFileSync(filePath)
    res.setHeader('Content-type', setContentType(filePath));
    res.write(fileContents);
    res.end();
  } else {
    responseError(res);
  }
});

const responseError = function(res) {
  res.statusCode = 404;
  res.write('file not found');
  res.end();
};

exports.app = app;
