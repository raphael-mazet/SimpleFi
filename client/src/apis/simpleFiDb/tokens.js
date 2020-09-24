import fetchRequest from '../fetchRequest';

const baseUrl = 'http://localhost:3020';
//FIXME: put this in secure folder
const tokensEP = '/tokens';
const fieldTokensEP = '/userfieldtokens'

//TODO: authentication - credentials: include
function  getTokens () {
  return fetchRequest(baseUrl + tokensEP);
}

function postUserFieldTokens (tokenIds, name) {
  return fetchRequest(baseUrl + fieldTokensEP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tokenIds)
  })
}

export {
  getTokens,
  postUserFieldTokens
}