const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require('helmet');
const routes = require('./routes/index');
const {
  createUser,
  login,
} = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { DATA_BASE } = process.env;

const { PORT = 3000 } = process.env;

mongoose.connect(`${DATA_BASE}`, {
  useNewUrlParser: true,
});
const app = express();

app.use(cors());
app.options('*', cors());

app.use(helmet());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

app.use('/', auth, routes);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не существует'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => /* eslint-disable no-console */console.log('ok'));
