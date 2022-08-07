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

![Tree of current directory]("images/Dir__Tree.png")

### Postgresql
