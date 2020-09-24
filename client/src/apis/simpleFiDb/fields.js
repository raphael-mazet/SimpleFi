import fetchRequest from '../fetchRequest';

const baseUrl = 'http://localhost:3020';
const fieldEP = '/fields';

function  getFields () {
  return fetchRequest(baseUrl + fieldEP);
}

export {
  getFields,
}