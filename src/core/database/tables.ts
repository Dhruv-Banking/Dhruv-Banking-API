// This file is in case I hit the database with a good ol' `sudo rm -rf /` or forget the ssh keys :skull:
import { pool } from "./pool";

async function createUsersTable(): Promise<void> {
  try {
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS users (
            uuid TEXT PRIMARY KEY NOT NULL,
            username TEXT NOT NULL,
            firstname TEXT NOT NULL,
            lastname TEXT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            phonenumber TEXT NOT NULL,
            checkings int8 NOT NULL,
            savings int8 NOT NULL,
            role TEXT NOT NULL,
            transactions jsonb NOT NULL
        );
        `
    );
  } catch (e: any) {
    console.log(e);
  }
}

async function createFlagIpTable(): Promise<void> {
  try {
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS flagip (
            ip TEXT PRIMARY KEY NOT NULL,
            queries int8 NOT NULL
        );
       `
    );
  } catch (e: any) {
    console.log(e);
  }
}

export async function createTables(): Promise<void> {
  await createUsersTable();
  await createFlagIpTable();
}
