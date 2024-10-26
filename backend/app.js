const express = require('express');
const bodyParser = require('body-parser');

const postRoutes = require('./routes/posts-routes');
const HttpError = require('./models/http-error');

const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/posts', postRoutes); // => /api/places...

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect('mongodb+srv://wasabi:wasabioiyeulam@wasabivu.vmztv.mongodb.net/utegram?retryWrites=true&w=majority&appName=WasabiVu')
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  })
