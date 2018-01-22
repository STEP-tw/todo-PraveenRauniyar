const User = require('./user.js');

class Users {
  constructor(users) {
    this.users = users;
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
    };
  };
};

module.exports = Users;
