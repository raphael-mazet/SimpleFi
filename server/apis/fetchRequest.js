const fetch = require('node-fetch');

async function fetchRequest (path, options) {
  const response = await fetch(path, options)
    .then(res => res.status <= 400 ? res : Promise.reject(res))
    .then(res => res.status !== 204 ? res.json() : res)
    .catch(err => {
      console.error(`Error fetching [${options ? options.method : 'GET'}] ${path}`);
      console.error('Error', err);
    })
  return response;
}

module.exports = fetchRequest;