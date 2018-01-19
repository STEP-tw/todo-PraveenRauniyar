const fs = require('fs');
const Users = require('./models/users.js');


if(!fs.existsSync('./data')){
  fs.mkdirSync('./data');
}

let users = new Users('./data');
users.addUser('praveen','0000');
users.addUser('manish','0000');
