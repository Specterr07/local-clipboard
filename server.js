import express from 'express';
import multer from 'multer';

const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    // Specify the directory where files should be saved
    cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
    // Use the original file name as the stored filename
    cb(null, file.originalname); 
    }
});
const upload = multer({storage:storage});
const PORT = 3000;
9518368961
let sharedData = "No text shared yet";

app.use (express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'))
app.set('view engine', 'ejs');

app.post('/update-text', (req, res) => {
    const recentText = req.body.content; 
    const body = req.body;
    sharedData = recentText;
    console.log(`Text Copied: ${sharedData}`)
 // console.log wont log the object's content.
    console.table(body)// console.table is able to log content of the object.
    res.redirect('/')

});

app.post('/upload-file', upload.single('uploaded-file'), (req, res) => {
    console.log(req.file);
    res.redirect('/');
    
});

app.get('/', function (req, res) {
    res.render('index', {title: "Local Clipboard",text: sharedData, files: []});
});

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});