// haircut/src/routes/index.js

const router = require('express').Router();
const userController = require('@controllers/user');
const pageController = require('@controllers/page');
const auth = require('@root/auth');

router.get('/', pageController.getHome);

router.get('/login', userController.getLogin);
router.get('/logout', userController.getLogout);
router.get('/account', auth.check, userController.getAccount);
router.get('/auth/linkedin', auth.withLinkedIn, userController.getLinkedInAuth);
router.get('/auth/linkedin/callback', auth.linkedInCallbackHandler);

router.get('/error/:statusCode', pageController.getError);

module.exports = router;
