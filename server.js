import express from 'express';

const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('index', {title: "Local Clipboard",text: "Waiting for data", files: []});
});

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});