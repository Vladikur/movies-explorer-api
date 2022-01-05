const router = require('express').Router();
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const createUser = require('./createUser');
const login = require('./login');
const auth = require('../middlewares/auth');

router.use('/signup', createUser);
router.use('/signin', login);

router.use('/', auth);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, moviesRoutes);

module.exports = router;
