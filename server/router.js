const router = require('express').Router();
const controllers = require('./controllers');

router.get('/tokens', controllers.getTokens);
router.get('/fields', controllers.getFields);
router.get('/userfieldtokens/:tokenIds', controllers.getUserFieldTokens);
router.get('/findfield/:receiptToken', controllers.getFieldWithReceiptToken);
router.get('/usertransactions/:address', controllers.getUserTransactions);

module.exports = router;