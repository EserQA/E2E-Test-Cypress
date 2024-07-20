/**
 *
 * @param {*} arr
 * @returns
 */

export const indexOfMax = (arr) => {
  let maxIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > arr[maxIndex]) {
      maxIndex = i;
    } else {
      // do nothing
    }
  }
  return maxIndex;
};

/**
 *
 * @returns
 */
export const todayDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
};
// module.exports = {indexOfMax}
