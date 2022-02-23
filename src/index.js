const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (require, response) => {
    response.send("O VASCAO TA GIGANTE 700 MILHA RAPA");
});

app.listen(3333);


