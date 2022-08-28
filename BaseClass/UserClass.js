const {v4: uuid4} = require("uuid"); // UUID maker

// User class to post a user.
class UserClass {
    constructor(uuid, username, firstname, lastname, email, password, role, checkings, savings) {
        this.uuid = uuid;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
        this.checkings = checkings;
        this.savings = savings;
    }

    get returnJson() {
        return {
            uuid: this.uuid,
            username: this.username,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            role: this.role,
            checkings: this.checkings,
            savings: this.savings
        }
    }
}

// Exporting user class, so we can use it from other files
module.exports = UserClass;