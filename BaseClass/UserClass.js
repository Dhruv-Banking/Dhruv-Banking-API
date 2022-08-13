const {v4: uuid4} = require("uuid"); // UUID maker

// User class to post a user.
class UserClass {
    constructor(username, firstname, lastname, email, password, role, checkings, savings) {
        this.uuid = uuid4(undefined, undefined, undefined);
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.checkings = checkings;
        this.savings = savings;
    }
}

// Exporting user class, so we can use it from other files
module.exports = UserClass;