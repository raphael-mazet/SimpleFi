import fetchRequest from '../fetchRequest';
import {baseUrl, fieldEP} from './simpleFiEPs';

function  getFields () {
  return fetchRequest(baseUrl + fieldEP);
}

export {
  getFields,
}