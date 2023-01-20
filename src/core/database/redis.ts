const redis = require("redis");
require("dotenv").config({ path: "../../.env" });

let host = process.env.HOST;
let port = process.env.REDIS_PORT;

export const client = redis.createClient({
  socket: {
    host: host,
    port: port,
  },
});

client.on("error", (err: any) => console.log("Redis Client Error", err));

client.connect();
