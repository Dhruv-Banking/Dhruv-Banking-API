# Dhruv-Banking

---

[Getting Started](#getting-started) | [User Modal](#user-modal) | [Endpoints](#end-points) | [Tokens](#tokens) | [Flagging Ip's](#flagging-ips) | [Roles](#roles) | [License](#license)

## Getting Started

First to get started, you'd clone the repo:

```shell
$ git clone https://github.com/Dhruv-Banking/Dhruv-Banking.git
```

then cd in the directory, and run the command below:

```shell
$ cd {directory name}
> npm init -y
> npm i --save express bcrypt cors dotenv express-rate-limit jsonwebtoken pg uuid
```

then also save these as dev dependencies (for ease of use)

```shell
$ npm i --save-dev nodemon morgan
```

then in the directory, create a `.env` file, and add these lines:

```
CONNECTIONSTRING={your connection string}
ACCESS_TOKEN_SECRET={your access token}
```

- For `CONNECTIONSTRING` add the connection to your own postgresql database
- For `ACCESS_TOKEN_SECRET` I used:

```shell
$ node
> require('crypto').randomBytes(64).toString('hex')
```

Your directory should look something like this, but there should be a `node_modules` directory:

<img src="src/images/Dir__Tree.png" alt="Tree of the current directory" title="Tree of the current directory">

---

## User Modal

- There are 3 models for users, but they all follow the same base user:

```json
{
  "uuid": "e2aad8a3-9968-4e2a-a0a3-a27f0b0519ba",
  "username": "Rick__Astley",
  "firstname": "Rick",
  "lastname": "Astley",
  "email": "rickastleyissocool@rick.astley",
  "password": "$2b$12$5z39LzhwvGI7jKfzTF7okOOR12q96CSRsavjgsGAj8hI4bquHIuye",
  "savings": 0,
  "checkings": 0,
  "role": "GOD"
}
```

as you can see, the password is hashed in-case a hacker get's access to the database.

---

## End points

> NOTE: localhost:3000 is a place holder untill i host it on google

Note: All the endpoints require a token, so see [Tokens]() for more info on getting a token

For all endpoints, if the token is null, or you don't provide one, or if you provide an expired one, or even if you include a fake one -- you'll get this error:

```json
{
  "result": "Forbidden"
}
```

#### List of all endpoints (Currently):

- localhost:3000/
- localhost:3000/getAllUsers
- localhost:3000/specificUser?username={username}
- localhost:3000/postUser
- localhost:3000/authUserLogin
- localhost:3000/deleteUser
- localhost:3000/updateUser?username={username}
- localhost:3000/checkingsToSavings?username={username}
- localhost:3000/savingsToCheckings?username={username}
- localhost:3000/transferToAnotherUser?userFrom={username}

### Localhost:3000/-GET

> This endpoint it the base url, to make sure everything works well.

This endpoint requires a token, and the token can have the role of anytype -- since it dosen't hold any data.

See [Tokens]() for more info on getting a token

If everything works fine, you should get the result:

```json
{
  "detail": "Please pick an endpoint, refer to the docs"
}
```

or if your token isn't valid, you will get this error:

```json
{
  "result": "Forbidden"
}
```

### Localhost:3000/getAllUsers-GET

When making this request, you need to provide a token, with the role of "GOD", or "ADMIN"

When you provide a valid token, the result should be as followed, a list full of JSON objects:

```json
[
  {
    "uuid": "e2aad8a3-9968-4e2a-a0a3-a27f0b0519ba",
    "username": "Rick__Astley",
    "firstname": "Rick",
    "lastname": "Astley",
    "email": "rickastleyissocool@rick.astley",
    "password": "$2b$12$5z39LzhwvGI7jKfzTF7okOOR12q96CSRsavjgsGAj8hI4bquHIuye",
    "savings": 69,
    "checkings": 420,
    "role": "GOD"
  }
]
```

if the token provided has the role of "BASIC", then you'll get this error:

```json
{
  "detail": "You don't have the right role"
}
```

### Localhost:3000/specificUser?username={username}-GET

This is the endpoint to get the data from the user, you can have any role to access this endpoint. But you need a token.

For a 200 resposne you should get:

```json
[
  {
    "uuid": "e2aad8a3-9968-4e2a-a0a3-a27f0b0519ba",
    "username": "Rick__Astley",
    "firstname": "Rick",
    "lastname": "Astley",
    "email": "rickastleyissocool@rick.astley",
    "savings": 0,
    "checkings": 0,
    "role": "GOD"
  }
]
```

or if the user does not exist, you'll get this error:

```json
{
  "detail": "User does not exist"
}
```

### Localhost:3000/postUser-POST

Any token role can access this endpoint, but if someone from your device has already made a request, then you can not make another one from the same Local IP address.

This is what the request body should look:

```json
{
  "username": "Rick__Astley",
  "firstname": "Rick",
  "lastname": "Astley",
  "email": "rickastleyissocool@rick.astley",
  "password": "ILoveRickAstleyNoHomo"
}
```

If the result is successfull you'll get the result of:

```json
{
  "detail": "Rick__Astley has been succesfully created!"
}
```

If the user with the name already exists, then you'll get this error:

```json
{
  "detail": "User with name 'Rick__Astley' already exists"
}
```

### Localhost:3000/authUserLogin-POST

This endpoint to to auth the user when they are trying to login. This is done server side for security.

This is what the request body should look like:

```json
{
  "username": "Rick__Astley",
  "password": "ILoveRickAstleyNoHomo"
}
```

If the credentials you provided are correct, you'll get this response:

```json
{
  "detail": "Success"
}
```

if the user does not exist, then you'll get this error:

```json
{
  "detail": "Incorrect username."
}
```

else if the password is incorrect, then you'll get this error:

```json
{
  "detail": "Failiure"
}
```

### Localhost:3000/deleteUser-DELETE

This is the endpoint to delete a user from the database, fo for this endpoint, you need to provide the users,

This is what the request body should look like:

```json
{
  "username": "RickAstley",
  "password": "ILoveRickAstleyNoHomo"
}
```

If credentials are correct, you will be sent back this message:

```json
{
  "detail": "'Rick__Astley' has been succesfully deleted"
}
```

or if the user does not exist, then you'll get this error:

```json
{
  "detail": "User does not User does not exist"
}
```

or if the password is incorrect, then you'll get back this message:

```json
{
  "detail": "Password Incorrect."
}
```

### Localhost:3000/updateUser?username={username}-PUT

This is the endpoint to update user, you provide the username of the user you want to update, you provide the user who you want to update in the URL.

What the request body should look like:

```json
{
  "change": "Username",
  "changeTo": "rICK__aSTLEY"
}
```

if the user does not exist, then you'll get this error:

```json
{
  "detail": "Please get a token with the same username as the user you are trying to update"
}
```

^ the reason for this error, is because I made a middleware that gets the username from the token, and compares it with the username from the request query, if they are not equal, then it sends back that error

Or if you provide a value to change from that dosent exist:

```json
{
  "detail": "Please provide record to change"
}
```

### Localhost:3000/checkingsToSavings?username={username}-PUT

### &&

### Localhost:3000/savingsToCheckings?username={username}-PUT

This is the endpoint to send money from checkings, to savings, and vice versa. This endpoint takes your username as a query parameter.

What the request body should look like:

```json
{
  "amount": 69420,
  "password": "ILoveRickAstleyNoHomo"
}
```

This is what a successfull result looks like:

```json
{
  "detail": "Successfully transered 10 from {account1} to {account2}"
}
```

> account1, can be savings, or checkings. Same for account2

Let's say you wanna send money from savings to checkings, first you need to make sure you have enough money, if you don't, then you'll get back this error

```json
{
  "detail": "Insufficent funds"
}
```

if the user does not exist, then you'll get this error:

```json
{
  "detail": "Can not find user"
}
```

or if the password is incorrect, you'll get this error:

```json
{
  "detail": "User not authenticated"
}
```

### Localhost:3000/transferToAnotherUser?userFrom={username}-PUT

This is the endpoint to send money from one user to another.

This is what a successful response looks like:

```json
{
  "detail": "Successfully transfered 69420 from 'dRayat' to Rick__Astley"
}
```

if the user recieving money does not exist, then we send back this error:

```json
{
  "detail": "User to send money to does not exist."
}
```

or, the user sending money does not exist, then we send back this error:

```json
{
  "detail": "User to send money does not exist."
}
```

if the password provided is incorrect, then we also send back this error:

```json
{
  "detail": "Password incorrect."
}
```

---

## Tokens

This is the endpoint to get a token for the API. You need a token to get access any endpoint for the API

### How to get a token:

You need to make a **POST** request to `http://localhost:3000/users/login`, and in the request body you need to provide your login details.

```json
{
  "name": "Rick__Astley",
  "password": "ILoveRickAstleyNoHomo"
}
```

when you provide these details, you should get result that looks like this:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

if the user is not in the database, you will get this error:

```json
{
  "detail": "You do not exist."
}
```

however, if the password is incorrect, then you'll get this error:

```json
{
  "detail": "Incorrect password"
}
```

### How tokens work:

the token gets the role from the table "users", and that's the role you get in the token.

```js
const user = {
  name: sqlRes.rows[0].username,
  password: sqlRes.rows[0].password,
  role: sqlRes.rows[0].role,
};
```

^ thats the data that the token has. Then we use a middleware to decrypt the token, and then we get the role from that token.

example of the middle ware:

```js
// JSW as an import
const jwt = require("jsonwebtoken");
const roleData = require("./roleData"); // Importing the secret role data

function returnRole(token) {
  let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded.role;
}

// ------------------- GET ------------------- //
function authRoleGetAllUsers(req, res, next) {
  var authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Spliting becase it goes: "Bearer [space] TOKEN"
  if (token === null) return res.sendStatus(401); // If the token sent is null, then we know there is no token to be verified

  // Saving the returned role to the var role
  let role = returnRole(token);

  // Veryifying the role to make sure
  if (role === roleData.admin || role === roleData.god) {
    next();
  } else {
    res.status(401);
    return res.send({ detail: "You don't have the right role" });
  }
}
```

---

## Flagging Ips

Since this is a banking app, we need a fancy smancy way of stopping the same person creating multiple accounts, so, I made a middleware to log the client Local IP address, to stop the same IP from making new accounts.

### How it works:

So I have a middleware setup on the post user endpoint which logs the IP to a database, and if they are in that database, then we know they have already made an account. **But**, if the user has GOD, or ADMIN privledges, then we allow them to make a new account.

---

## Roles

There are 3 Main Roles:

1. GOD
2. ADMIN
3. BASIC

But, there is one other role. Dhruv's special role

- DHRUV

This role can be used to make SQL queries to the database, but from the API.

## Licence

So far, there is no Licence -- since it's my own code. And I don't wanna burden anyone with looking at this abomination of an express REST api.

```

```
