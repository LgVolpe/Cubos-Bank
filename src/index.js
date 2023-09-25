const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const routes = require('./routes/routes');

app.use('/', routes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
