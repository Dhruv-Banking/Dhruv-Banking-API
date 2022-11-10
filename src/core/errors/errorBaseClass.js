class Error {
    constructor(message) {
        this.message = message;
        this.name = "Error";
    }
}

class NoPassword extends Error {
    constructor(message) {
        super(message);
        this.name = "No Password";
    }

    static ReturnError(res) {
        return res.status(400).send("Please provide a password");
    }
}

class NoUsername extends Error {
    constructor(message) {
        super(message);
        this.name = "Provide Username";
    }

    static ReturnError(res) {
        return res.status(400).send("Please provide a Username");

    }
}

module.exports = {
    Error,
    NoPassword,
    NoUsername,
};
