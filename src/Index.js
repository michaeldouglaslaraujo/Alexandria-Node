const express = require('express');
const bodyParser = require ('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const rotas = require('./app/rotas/rotas')
rotas(app);

require('./app/controllers/index')(app);

app.listen(3800, function(){
    console.log('Servidor rodando na porta 3800');
});

//module.exports = app;