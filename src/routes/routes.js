const router = require('express').Router();
const routes = {
    my:require('./my'),
    callback:require('./callback')
};
const middleware = {
    isSignedIn:require('../middleware/session').isSignedIn
}
const controllers = {
    login:require('../controllers/login'),
    register:require('../controllers/register'),
    redirect:require('../controllers/redirect'),
    logout:require('../controllers/logout'),
    charts:require('../controllers/charts')
}

router.use('/my',middleware.isSignedIn,routes.my);
router.use('/callback',routes.callback);
router.get('/logon',controllers.login.logon);
router.get('/',controllers.login.index);
router.get('/redirect',controllers.redirect.get);
router.get('/register',controllers.register.get);
router.post('/register',controllers.register.post);
router.get('/logout',controllers.logout.get);

router.get('/charts',controllers.charts.index);
router.get('/charts/global/:type',controllers.charts.global);
router.get('/charts/:countryID/:type',controllers.charts.national);

module.exports = router;