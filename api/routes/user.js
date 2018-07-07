const express = require('express');
const router = express();
const checkAuth = require('../middleware/check-auth')

const UsersController = require('../controllers/users');

router.post("/signup", UsersController.create_user);

router.post('/login', UsersController.login)

router.delete("/:userId", checkAuth, UsersController.delete_user);

module.exports = router;