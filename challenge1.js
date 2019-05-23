//return an array of a number's divisibles
function divisors(integer) {
    const divisorsArray = [];
    for(let x = 1; x < integer; x++){
      if(x !== 1 && integer%x === 0){
        divisorsArray.push(x);
      }
    }
    return divisorsArray;
};