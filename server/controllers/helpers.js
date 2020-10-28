//TODO: probably need to use an input validator here for security if pure SQL

function generateFieldTokenQuery (tokenIds) {
  let queryArr = [];
  for (let prop in tokenIds) {
    if (tokenIds[prop]) queryArr.push(tokenIds[prop])
  }
  return queryArr;
}

module.exports = {
  generateFieldTokenQuery,
}