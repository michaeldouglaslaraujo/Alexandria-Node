require('marko/node-require').install();
require('marko/express');

const express = require('express');
const app = express();

const bodyParser = require ('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const rotas = require('../app/rotas/rotas')
rotas(app);

require('../app/controllers/authController')(app);
require('../app/controllers/projectController')(app);


module.exports = app;