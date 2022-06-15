const express = require('express');
//require('express-async-errors');
const routers = require('./server/routs/api')
// const path = require('path');
const port = 8080;
const app = express();

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('/dist/main.js', { root: __dirname });
});

app.listen(port, () => {
    console.log("Server started on port", port);
});