const SALT_ROUNDS = 10;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .status(200)
        .send({
          token,
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({
    email,
  })
    .then((userData) => {
      if (userData) {
        throw new ConflictError('Пользователь с таким email зарегистрирован');
      }

      return bcrypt.hash(password, SALT_ROUNDS)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
        }))
        .then((user) => {
          if (user) {
            res
              .status(201)
              .send({ email: user.email, name: user.name, id: user._id });
          }
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные для создания пользователя'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send(user);
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для изменения данных пользователя'));
      } else {
        next(error);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send(user);
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createUser,
  patchUser,
  login,
  getCurrentUser,
};
