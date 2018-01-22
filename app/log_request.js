const timeStamp = require('./time.js').timeStamp;
const fs = require("fs");

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

exports.logRequest = logRequest;
