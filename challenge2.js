// Flattens an hierarchical map into a single level
function extractKeys(currentKey, into, target){
    for(let i in into){
      if (into.hasOwnProperty(i)){
        let newKey = i;
        let newValue = into[i];
        
        if(currentKey.length > 0){
          newKey = currentKey + '/' + i;
        }
        
        if(typeof newValue === 'object'){
          if(newValue instanceof Array === true){
            target[newKey] = newValue;
          }else if(newValue == null){
            target[newKey] = null;
          }else{
            extractKeys(newKey, newValue, target);
          }
        } else {
          target[newKey] = newValue;
        }
      }
    }
  }
  function flattenMap(map) {
    // Add your code here
    const newMap = {};
    extractKeys('', map, newMap);
    return newMap;
  }