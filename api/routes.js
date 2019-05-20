// Initialize express router
let router = require('express').Router();
let ResponseTypes = require('../model/responseTypes');

// Set default API response
router.get('/', function (req, res) {
    res.json({
        code: ResponseTypes.success.code,
        msg: 'Welcome to REST Api',
    });
});

// Import controller
var recordController = require('../controller/recordController');

// Define routes
router.route('/records')
    .post(recordController.routes);

router.route('/records/:id')
    .get(recordController.view);

// Export API routes
module.exports = router;