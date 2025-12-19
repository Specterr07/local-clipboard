import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', function (req, res) {
    res.send("System Online");
})

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});