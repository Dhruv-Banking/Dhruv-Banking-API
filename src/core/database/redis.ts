import { createClient } from "redis";
require("dotenv").config({ path: "../../.env" });

let host = process.env.HOST;
let port = parseInt(process.env.REDIS_PORT!);

export const client = createClient({
  socket: {
    host: host,
    port: port,
  },
});

client.connect();
