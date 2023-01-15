/**
 * Function to loop through an array and check if the items are null, undefined, or an empty string
 * @param items array of items
 * @returns boolen, false a item is false, true is the entire array elemets is not empty
 */
export function verifyArray(items: string[]): boolean {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === undefined || items[i] === "" || items[i] === null) {
      return false;
    }
  }

  return true;
}
