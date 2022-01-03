const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (movies) {
        return res
          .status(200)
          .send(movies);
      }
      throw new BadRequestError('Переданы некорректные данные для отображения фильмов');
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      res
        .status(201)
        .send(movie);
    })
    .catch(() => {
      next(new BadRequestError('Переданы некорректные данные для добавления фильма'));
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемый фильм не найден');
      }
      return movie;
    })
    .then((movie) => {
      if (`${movie.owner}` === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((deletedMovie) => {
            if (deletedMovie) {
              res
                .status(200)
                .send(deletedMovie);
            }
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Нельзя удалять фильмы других пользователей');
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
