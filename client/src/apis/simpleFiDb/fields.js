import fetchRequest from '../fetchRequest';

const baseUrl = 'http://localhost:3020';
const fieldEP = '/fields';

function  getFields () {
  return fetchRequest(baseUrl + fieldEP);
}

function getFieldSummary (idObj) {
  return fetchRequest
  //from server
}

export {
  getFields,
}