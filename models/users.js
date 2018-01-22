const User = require('./user.js');
const fs = require('fs');

const exists = function(path){
  return fs.existsSync(path);
};

const getUserDetails = function(path){
  if(exists(path)){
    let usersDetails = fs.readFileSync(path,'utf8');
    return JSON.parse(usersDetails);
  }
  return {};
};

const writeJsonFile = function(path,content){
  content = JSON.stringify(content,null,2);
  fs.writeFileSync(path,content);
};

const createFile = function(path){
  fs.openSync(path,'w+');
};

class Users {
  constructor(root) {
    this.src = root || './data';
    this.users = getUserDetails(`${this.src}/users.JSON`);
  };
  getUsers(){
    return this.users;
  };
  userExists(userName){
    return Object.keys(this.getUsers()).includes(userName);
  };

  getSpecificUser(field,value){
    let users = this.getUsers();
    let usernames = Object.keys(users);
    let user;
    usernames.forEach((username)=>{
      if(users[username][field] == value){
        user = users[username];
      }
    })
    return user;

  }

  addUser(userName,password){
    if(!this.userExists(userName)){
      this.users[userName] = new User(userName,password);
      writeJsonFile(`${this.src}/users.JSON`,this.getUsers());
    };
  };
};

module.exports = Users;
