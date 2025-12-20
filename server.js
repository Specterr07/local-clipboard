import express from 'express';

const app = express();
const PORT = 3000;

let sharedData = "No text shared yet";

app.use (express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.post('/update-text', (req, res) => {
    const recentText = req.body.content;
    sharedData = recentText;
    console.log(`Text Copied: ${sharedData}`)
    res.redirect('/')
})

app.get('/', function (req, res) {
    res.render('index', {title: "Local Clipboard",text: "Waiting for data", files: []});
});

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});