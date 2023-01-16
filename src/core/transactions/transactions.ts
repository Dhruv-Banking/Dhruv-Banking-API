import { pool } from "../database/pool";

/*
// One account to another
jsonToAppend = {
    from: <checkingsToSavings || savingsToCheckings>,
    amount: <some int>,
    time: 
}
*/

/*
// One user to another
jsonToAppend = {
    userTo: <user sent money>,
    amount: <somt int>,
    time: 
}
*/

export async function updateCheckingsToSavings(
  username: string,
  amount: number,
  time: object
): Promise<void> {
  console.log(username);
  console.log(amount);
  console.log(time);
}

export async function updateSavingsToCheckings(
  username: string,
  amount: number,
  time: object
): Promise<void> {}

export async function updateToAnotherUser(
  username: string,
  amount: number,
  userTo: string,
  time: object
): Promise<void> {}
