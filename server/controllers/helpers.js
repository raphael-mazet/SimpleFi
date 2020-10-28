//TODO: probably need to use an input validator here for security if pure SQL

function generateFieldTokenQuery (tokenIds) {
  let queryArr = [];
  for (let prop in tokenIds) {
    if (tokenIds[prop]) queryArr.push(tokenIds[prop])
  }
  return queryArr;
}

// function generateFieldTokenQuery (tokenIds) {
//   let queryStr = '';
//   for (let prop in tokenIds) {
//     if (tokenIds[prop]) queryStr += `token_id = '${tokenIds[prop]}' OR `;
//   }
//   return queryStr.slice(0, -4);
// }

module.exports = {
  generateFieldTokenQuery,
}