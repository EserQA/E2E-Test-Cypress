export const indexOfMax = (arr) => {
    return arr.reduce((maxIndex, elem, i, arr) =>  
    elem > arr[maxIndex] ? i : maxIndex, 0)
}

// module.exports = {indexOfMax}