const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  patchUser,
  getCurrentUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/me', auth, getCurrentUser);

router.patch(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email(),
    }),
  }),
  patchUser,
);

module.exports = router;
