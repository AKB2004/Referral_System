const express = require('express');
const PORT = 2000;
const app = express();

app.listen(2000,() => {
    console.log(`server running on port ${PORT} `)
})