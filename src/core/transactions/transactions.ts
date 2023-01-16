import { pool } from "../database/pool";
import _ from "underscore";

/**
 * Updates the transactions on the user from account to account
 * @param username Username of the user being updated
 * @param amount Amount of money being transfered
 * @param time Time when the transaction took place
 * @returns Promise<boolean>
 */
export async function updateCheckingsToSavings(
  username: string,
  amount: number,
  time: object
): Promise<boolean> {
  let sqlRes;

  let query = "SELECT transactions FROM public.users WHERE username=$1";
  let values: any[] = [username];

  try {
    sqlRes = await pool.query(query, values);
  } catch (err: any) {
    console.log(err.stack);
    return false;
  }

  const jsonToAppend = [
    {
      fromAccount: "Checkings",
      toAccount: "Savings",
      amount: amount,
      time: time,
      toAnotherUser: false,
    },
  ];

  if (_.isEqual(sqlRes.rows[0].transactions, {})) {
    query = "UPDATE public.users SET transactions=$1 WHERE username=$2;";
    values = [JSON.stringify(jsonToAppend), username];

    try {
      await pool.query(query, values);
    } catch (err: any) {
      console.log(err.stack);
      return false;
    }

    return true;
  } else {
    let currentJson = sqlRes.rows[0].transactions;
    let newJsonToAppend = JSON.stringify(
      JSON.parse(JSON.stringify(currentJson.concat(jsonToAppend)))
    );

    query = "UPDATE public.users SET transactions=$1 WHERE username=$2;";
    values = [newJsonToAppend, username];

    try {
      await pool.query(query, values);
    } catch (err: any) {
      return false;
    }

    return true;
  }
}

/**
 * Updates the transactions on the user from account to account
 * @param username Username of the user being updated
 * @param amount Amount of money being transfered
 * @param time Time when the transaction took place
 * @returns Promise<boolean>
 */
export async function updateSavingsToCheckings(
  username: string,
  amount: number,
  time: object
): Promise<boolean> {
  let sqlRes;

  let query = "SELECT transactions FROM public.users WHERE username=$1";
  let values: any[] = [username];

  try {
    sqlRes = await pool.query(query, values);
  } catch (err: any) {
    console.log(err.stack);
    return false;
  }

  const jsonToAppend = [
    {
      fromAccount: "Savings",
      toAccount: "Checkings",
      amount: amount,
      time: time,
      toAnotherUser: false,
    },
  ];

  if (_.isEqual(sqlRes.rows[0].transactions, {})) {
    query = "UPDATE public.users SET transactions=$1 WHERE username=$2;";
    values = [JSON.stringify(jsonToAppend), username];

    try {
      await pool.query(query, values);
    } catch (err: any) {
      console.log(err.stack);
      return false;
    }

    return true;
  } else {
    let newJsonToAppend = JSON.stringify(
      JSON.parse(
        JSON.stringify(sqlRes.rows[0].transactions.concat(jsonToAppend))
      )
    );

    query = "UPDATE public.users SET transactions=$1 WHERE username=$2;";
    values = [newJsonToAppend, username];

    try {
      await pool.query(query, values);
    } catch (err: any) {
      return false;
    }

    return true;
  }
}

/**
 * Updates the transactions on the user from one user to another
 * @param username Username of the user being updated
 * @param amount Amount of money being transfered
 * @param userTo User being sent the money
 * @param time Time when the transaction took place
 * @returns  Promise<boolean>
 */
export async function updateToAnotherUser(
  username: string,
  amount: number,
  userTo: string,
  time: object
): Promise<boolean> {
  let sqlRes;

  let query = "SELECT transactions FROM public.users WHERE username=$1";
  let values: any[] = [username];

  try {
    sqlRes = await pool.query(query, values);
  } catch (err: any) {
    console.log(err.stack);
    return false;
  }

  const jsonToAppend = [
    {
      fromAccount: "Checking",
      toAccount: "Checkings",
      userTo: userTo,
      amount: amount,
      time: time,
      toAnotherUser: true,
    },
  ];

  if (_.isEqual(sqlRes.rows[0].transactions, {})) {
    query = "UPDATE public.users SET transactions=$1 WHERE username=$2;";
    values = [JSON.stringify(jsonToAppend), username];

    try {
      await pool.query(query, values);
    } catch (err: any) {
      console.log(err.stack);
      return false;
    }

    return true;
  } else {
    let newJsonToAppend = JSON.stringify(
      JSON.parse(
        JSON.stringify(sqlRes.rows[0].transactions.concat(jsonToAppend))
      )
    );

    query = "UPDATE public.users SET transactions=$1 WHERE username=$2;";
    values = [newJsonToAppend, username];

    try {
      await pool.query(query, values);
    } catch (err: any) {
      return false;
    }

    return true;
  }
}
