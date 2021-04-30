export function chunkData(array: unknown[], chunk = 10) {
  let i, j;
  const newArray = [];
  for (i = 0, j = array.length; i < j; i += chunk) {
    newArray.push(array.slice(i, i + chunk));
  }

  return newArray;
}
