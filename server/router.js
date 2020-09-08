const router = require('express').Router();
const controllers = require('./controllers/tokens')

//TODO: create multiple users and retrieve tokens
//TODO: relate users to tokens
router.get('/mytokens', controllers.getTokens);

router.post('/mytokens', controllers.createToken);

router.delete('/mytokens/:_id', controllers.deleteOne);

module.exports = router;