const timeStamp = require('./time.js').timeStamp;
const fs = require('fs');
const setContentType = require("./content_type.js").setContentType;
const logRequest = require('./log_request.js').logRequest;
const Users = require("../models/users.js");

const getAllUsers = function(fs){
   let data = fs.readFileSync('./data/users.JSON','utf8');
   return JSON.parse(data);
}


let app = require('./webapp.js').create();
app.fs = fs;
const toS = o => JSON.stringify(o, null, 2);

let users = new Users(getAllUsers(app.fs));

let loadUser = (req,res) => {
  let sessionid = req.cookies.sessionid;
  let user = users.getSpecificUser("sessionid",sessionid);
  if (sessionid && user) {
    user.__proto__ = new User().__proto__;
    req.user = user;
  };
};
const responseError = function(res) {
  res.statusCode = 404;
  res.write('file not found');
  res.end();
};

const getFilePath = function(req) {
  if (req.url == "/") {
    return `./public/welcomePage.html`;
  };
  return `./public${req.url}`;
};

const serverStaticFiles = function(req, res) {
  let filePath = getFilePath(req);
  if (this.fs.existsSync(filePath)) {
    let fileContents = this.fs.readFileSync(filePath);
    res.setHeader('Content-type', setContentType(filePath));
    res.write(fileContents);
    res.end();
  } else {
    responseError(res);
  };
};


app.use(serverStaticFiles.bind(app));
app.use(logRequest);
app.use(loadUser);


exports.app = app;
