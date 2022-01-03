const router = require('express').Router();
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRoutes);
router.use('/movies', auth, moviesRoutes);

module.exports = router;
