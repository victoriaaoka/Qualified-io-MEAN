//Return the minimum number of swaps needed to sort an array in reverse.
function swap(array, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
function minimumSwaps(ratings) {
  let swaps = 0;
  for (let i = 0; i < ratings.length; i++) {
    let min = i;
    for (let j = i; j < ratings.length; j++) {
      if (ratings[j] > ratings[min]) {
        min = j;
      }
    }
    if (i !== min) {
      swap(ratings, i, min);
      swaps += 1;
    }
  }
  return swaps;
}
