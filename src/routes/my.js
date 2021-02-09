/**
 * All routes for /my path
 */
const router = require('express').Router();
const routes = {
    orders:require('./my/orders'),
    inventory:require('./my/inventory'),
    settings:require('./my/settings'),
    gdpr:require('./my/gdpr'),
    api:require("./my/api")
}
const controllers = {
    dashboard:require('../controllers/my/index')
}

router.get('/',controllers.dashboard.redirectToMe);
router.use('/api',routes.api);
router.get('/dashboard',controllers.dashboard.dashboard);
router.use('/orders',routes.orders);
router.use('/inventory',routes.inventory);
router.use('/settings',routes.settings);
router.use('/gdpr',routes.gdpr);

module.exports = router;