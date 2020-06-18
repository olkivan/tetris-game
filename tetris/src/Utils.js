function RGB(r, g, b) {
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function deepcopy(object) {
  if (!object) throw new Error('Invalid object to copy:', object);

  return JSON.parse(JSON.stringify(object));
}

function createAndFillArray(size, value) {
  if (!size || size <= 0) throw new Error('Invalid array size:', size);

  const arr = new Array(size);
  for (let i = 0; i < arr.length; ++i) {
    arr[i] = deepcopy(value);
  }

  return arr;
}

function createAndFill2DArray(totalRows, totalColumns, value) {
  if (!totalRows || totalRows <= 0 || !totalColumns || totalColumns <= 0) {
    throw new Error('Invalid 2D array size');
  }

  const rows = new Array(totalRows);
  for (let i = 0; i < rows.length; ++i) {
    rows[i] = createAndFillArray(totalColumns, value);
  }

  return rows;
}


export {
  RGB,
  deepcopy,
  createAndFill2DArray
};
