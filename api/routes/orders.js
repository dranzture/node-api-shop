const express = require('express');
const router = express();

const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);

router.get('/:ID', checkAuth, OrdersController.orders_get_by_id);

router.post('/', checkAuth, OrdersController.create_order);

router.patch(':/orderId', checkAuth, OrdersController.patch_order)

router.delete('/:orderId', checkAuth, OrdersController.delete_order);

module.exports = router;