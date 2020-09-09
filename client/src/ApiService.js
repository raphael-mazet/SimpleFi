
const baseUrl = 'http://localhost:3020';
const tokenEP = '/mytokens';

function  getTokens () {
  return fetchRequest(tokenEP);
}

function fetchRequest (path, options) {
  return fetch(baseUrl + path, options)
    .then(res => res.status <= 400 ? res : Promise.reject(res))
    .then(res => res.status !== 204 ? res.json() : res)
    .catch(o_O => {
      console.error(`Error fetching [${options ? options.method : 'GET'}] ${path}`);
      console.error('Error', o_O);
    })
}

export default {
  getTokens
}