const validator = require('validator');
const BadRequestError = require('../errors/bad-request-err');

const valdatorURL = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('Передана некорректная ссылка');
};

module.exports = valdatorURL;
