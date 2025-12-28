import express from 'express';
import multer from 'multer';

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Specify the directory where files should be saved
    },
    filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name as the stored filename
    }
});

const upload = multer({storage:storage});
const PORT = 3000;

let sharedText = "No text shared yet";
let sharedFile = [];

app.use (express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');

app.post('/update-text', (req, res) => {
    const recentText = req.body.content; 
    const body = req.body;
    sharedText = recentText;
    console.log(`Text Copied: ${sharedText}`)
 // console.log wont log the object's content.
    console.table(body)// console.table is able to log content of the object.
    res.redirect('/')

});

app.post('/upload-file', upload.single('uploaded-file'), (req, res) => {
    const fileInfo = {
    filename: `${req.file.originalname}`,
    path: `${req.file.path}`};

    sharedFile.push(fileInfo);
    console.log(sharedFile);
    res.redirect('/');
    
});

app.get('/', function (req, res) {
    res.render('index', {title: "Local Clipboard",text: sharedText, files: sharedFile});
});



app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});