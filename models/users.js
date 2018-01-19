const User = require('./user.js');
const fs = require('fs');

const exists = function(path){
  return fs.existsSync(path);
}

const getUserDetails = function(){
  let path = './data/users.JSON';
  if(exists(path)){
    let usersDetails = fs.readFileSync(path,'utf8');
    return JSON.parse(usersDetails);
  }
  return {};
}

const writeToJsonFile = function(path,content){
  content = JSON.stringify(content,null,2);
  fs.writeFileSync(path,content);
}

const createFile = function(path){
  fs.openSync(`./data/${path}.JSON`,'w+');
}

class Users {
  constructor() {
    this.users = getUserDetails();
  }
  getUsers(){
    return this.users;
  }
  userExists(userName){
    return Object.keys(this.getUsers()).includes(userName);
  }

  addUser(userName,password){
    if(!this.userExists(userName)){
      this.users[userName] = new User(userName,password);
      createFile(userName);
      writeToJsonFile(`./data/users.JSON`,this.getUsers());
      console.log(this.users[userName]);
      writeToJsonFile(`./data/${userName}.JSON`,this.users[userName]);
    }
  }
}

module.exports = Users;
