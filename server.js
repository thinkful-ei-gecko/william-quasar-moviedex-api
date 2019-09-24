require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const MOVIES = require('./movies.json');

const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).send({ error: 'Unauthorized request' });
  }

  next();
});

function handleSearchQuery(req, res) {
  const { genre, country, avg_vote } = req.query;

  let filteredMovies = MOVIES;
  if (genre) {
    filteredMovies = filteredMovies.filter( (movie) => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if (country) {
    filteredMovies = filteredMovies.filter( (movie) => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if (avg_vote) {
    filteredMovies = filteredMovies.filter( (movie) => movie.avg_vote >= Number(avg_vote));
  }

  res.json(filteredMovies);
}

app.get('/movie', handleSearchQuery);

app.listen(8000, () => {
  console.log('Server listening at port 8000');
});