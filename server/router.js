const router = require('express').Router();
const controllers = require('./controllers/tokens')

//TODO: getAll tokens
//TODO: create multiple users and retrieve tokens
//TODO: relate users to tokens
router.get('/mytokens', controllers.getTokens);

//TODO: create a new token
router.post('/mytokens', controllers.createToken)

module.exports = router;