const obj = {
  name: 'Luke Skywalker',
  title: '',
  age: 23
};

// Convert `obj` to a key/value array
// `[['name', 'Luke Skywalker'], ['title', 'Jedi Knight'], ...]`
const asArray = Object.entries(obj);
console.log('asArray',asArray)

//   const filtered = asArray.filter(([key, value]) => typeof value === 'string');
//   const filtered = asArray.filter(([key, value]) => value !== '');
const filtered = asArray.filter(([key, value]) => key === 'name');
console.log('filtered',filtered)

// Convert the key/value array back to an object:
// `{ name: 'Luke Skywalker', title: 'Jedi Knight' }`
const justStrings = Object.fromEntries(filtered);
console.log('justStrings',justStrings)