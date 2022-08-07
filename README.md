# Dhruv-Banking

---

[Getting Started](#getting-started) | [User Modal](#user-modal) | [Endpoints](#end-points) | [Tokens](#tokens) | [Flagging Ip's](#flaging-ip) | [Roles](#roles) | [License](#license)

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

Your directory should look like this:

<img src="images/Dir__Tree.png" alt="Tree of the current directory" title="Tree of the current directory">

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
  "role": "BASIC"
}
```

as you can see, the password is hashed in-case a hacker get's access to the database.

---

## End points

> http:/localhost:3000 is a place holder untill i host it on google

List of all endpoints (Currently):

- [http://localhost:3000](#http://localhost:3000)
- [http://localhost:3000/users/login](#http://localhost:3000/users/login)
- `http://localhost:3000/getAllUsers`
- `http://localhost:3000/specificUser?username={username}`
- `http://localhost:3000/postUser`
- `http://localhost:3000/authUserLogin`
- `http://localhost:3000/deleteUser`
- `http://localhost:3000/updateUser?username={username}}`
- `http://localhost:3000/checkingsToSavings?username={username}`
- `http://localhost:3000/savingsToCheckings?username={username}`
- `http://localhost:3000/transferToAnotherUser?userFrom={username}`
