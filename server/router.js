const router = require('express').Router();
const controllers = require('./controllers');

//TODO: create multiple users and retrieve tokens
//TODO: relate users to tokens
router.get('/tokens', controllers.getTokens);
router.get('/fields', controllers.getFields);

// router.post('/mytokens', controllers.createToken);

// router.delete('/mytokens/:_id', controllers.deleteOne);

module.exports = router;