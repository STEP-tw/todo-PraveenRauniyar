const fs = require('fs');
const Users = require('./models/users.js');


if(!fs.existsSync('./data')){
  fs.mkdirSync('./data');
}

let users = new Users({});
users.addUser('praveen','0000');
users.addUser('manish','0000');

fs.writeFileSync('./data/users.JSON',JSON.stringify(users.users,null,2));
