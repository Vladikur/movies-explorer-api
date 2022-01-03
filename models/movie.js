const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /^(http|https):\/\/[^ "]+$/.test(value);
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /^(http|https):\/\/[^ "]+$/.test(value);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /^(http|https):\/\/[^ "]+$/.test(value);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
