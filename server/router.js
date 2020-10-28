const router = require('express').Router();
const controllers = require('./controllers');

//TODO: create multiple users and record transactions
router.get('/tokens', controllers.getTokens);
router.get('/fields', controllers.getFields);
router.get('/userfieldtokens/:tokenIds', controllers.getUserFieldTokens);
router.get('/prismatest', controllers.getTokensPrisma);

module.exports = router;