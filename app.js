const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require('helmet');
const routes = require('./routes/index');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { apiLimiter } = require('./middlewares/rateLimit');
const errorsHandler = require('./middlewares/errorsHandler');

const { NODE_ENV, DATA_BASE } = process.env;

const { PORT = 3000 } = process.env;

mongoose.connect(`${NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb'}`, {
  useNewUrlParser: true,
});
const app = express();

app.use(cors());
app.options('*', cors());

app.use('/api', apiLimiter);

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

app.use('/', routes);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => /* eslint-disable no-console */console.log('ok'));
