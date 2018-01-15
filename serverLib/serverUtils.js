const timeStamp = require('./time.js').timeStamp;
const fs = require("fs");
const registered_users = require("./registeredUser.js").registered_users;

const setContentType = function(filePath) {
  let lastIndexOfDot = filePath.lastIndexOf(".");
  let contentType = filePath.substr(lastIndexOfDot);
  let type = {
    "/": "text/html",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".pdf": "text/pdf",
    ".ico": "image/ico"
  };
  return type[contentType];
};

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
  }
};

exports.loadUser = loadUser;
exports.logRequest = logRequest;
exports.setContentType = setContentType;
