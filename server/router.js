const router = require('express').Router();
const controllers = require('./controllers/tokens');
const controllers2 = require('./controllers/tokens2');

//TODO: create multiple users and retrieve tokens
//TODO: relate users to tokens
router.get('/mytokens', controllers.getTokens);

router.post('/mytokens', controllers.createToken);

router.delete('/mytokens/:_id', controllers.deleteOne);

router.get('/myothertokens', controllers2.getTokens)

module.exports = router;