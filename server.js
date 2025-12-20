import express from 'express';

const app = express();
const PORT = 3000;

let sharedData = "No text shared yet";

app.use (express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.post('/update-text', (req, res) => {
    const recentText = req.body.content;
    const body = req.body;
    sharedData = recentText;
    console.log(`Text Copied: ${sharedData}`)

    console.log(`Copied Object: ${body}`) // console.log wont log the object's content.
    console.table(body)// console.table is able to log content of the object.
    res.redirect('/')

})

app.get('/', function (req, res) {
    res.render('index', {title: "Local Clipboard",text: sharedData, files: []});
});

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});