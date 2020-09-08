
const baseUrl = 'http://localhost:3020';

function  getTokens () {
  return fetchRequest('/mytokens')
}

function fetchRequest (path, options) {
  return fetch(basUrl + path, options)
    .then(res => res <= 400 ? res : Promise.reject(res))
    .then(res => res !== 204 ? res.json() : res)
    .catch(o_O => console.log(o_O))
}