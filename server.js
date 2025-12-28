const express = require('express');
const multer = require('multer');
const QRCode = require('qrcode');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Get app directory - works both in development and when packaged with pkg
// pkg sets process.pkg to true when running as executable
// When packaged, files are in /snapshot/<package-name>/
let appDir;
if (process.pkg) {
    // When packaged with pkg, files are in /snapshot/local-clipboard/
    appDir = '/snapshot/local-clipboard';
    // Verify the directory exists, fallback to execPath directory if not
    if (!fs.existsSync(path.join(appDir, 'server.js'))) {
        appDir = path.dirname(process.execPath);
    }
} else {
    // In development, use __dirname
    appDir = __dirname;
}

// [function to find your actual Local IP automatically]
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const app = express();

// Ensure uploads directory exists
// When packaged with pkg, create uploads next to executable (writable location)
// In development, create in project directory
let uploadsDir;
if (process.pkg) {
    // Create uploads directory next to the executable
    uploadsDir = path.join(path.dirname(process.execPath), 'uploads');
} else {
    // In development, use project directory
    uploadsDir = path.join(appDir, 'uploads');
}
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Sanitize filename for cross-platform compatibility
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, Date.now() + '_' + sanitized);
    }
});

// Configure multer with file size limits (100MB default, works on all platforms)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    },
    fileFilter: (req, file, cb) => {
        // Accept all file types for cross-platform compatibility
        cb(null, true);
    }
});
const PORT = 3000;

let sharedText = "No text shared yet";
let sharedFile = [];

app.use('/uploads', express.static(uploadsDir));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parser for better cross-platform support

// Set views directory - works both in development and when packaged with pkg
app.set('views', path.join(appDir, 'views'));
app.set('view engine', 'ejs');

app.post('/update-text', (req, res) => {
    const recentText = req.body.content; 
    const body = req.body;
    sharedText = recentText;
    res.redirect('/')

});

app.post('/upload-file', upload.single('uploaded-file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send(`
                <body style="background:#222; color:white; font-family:sans-serif; text-align:center; padding-top:100px;">
                    <h2>❌ Upload Failed</h2>
                    <p>No file was selected or file is too large.</p>
                    <a href="/" style="color: #4dabf7;">Go Back</a>
                </body>
            `);
        }

        const fileInfo = {
            filename: req.file.originalname,
            storedFilename: req.file.filename, // Store the actual filename on disk
            url: '/uploads/' + req.file.filename
        };

        sharedFile.push(fileInfo);
        console.log('File uploaded:', fileInfo);
        res.redirect('/');
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send(`
            <body style="background:#222; color:white; font-family:sans-serif; text-align:center; padding-top:100px;">
                <h2>❌ Upload Error</h2>
                <p>${error.message}</p>
                <a href="/" style="color: #4dabf7;">Go Back</a>
            </body>
        `);
    }
});

// Error handler for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send(`
                <body style="background:#222; color:white; font-family:sans-serif; text-align:center; padding-top:100px;">
                    <h2>❌ File Too Large</h2>
                    <p>File size exceeds 100MB limit.</p>
                    <a href="/" style="color: #4dabf7;">Go Back</a>
                </body>
            `);
        }
    }
    next(error);
});

// Helper function to get MIME type (cross-platform compatible)
function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.txt': 'text/plain',
        '.zip': 'application/zip',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

// Download route with proper headers for cross-platform compatibility (iPhone, Android, Windows)
app.get('/download/:filename', (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.filename);
        const filePath = path.join(uploadsDir, filename);
        
        // Check if file exists (cross-platform path handling)
        if (!fs.existsSync(filePath)) {
            return res.status(404).send(`
                <body style="background:#222; color:white; font-family:sans-serif; text-align:center; padding-top:100px;">
                    <h2>❌ File Not Found</h2>
                    <a href="/" style="color: #4dabf7;">Go Back</a>
                </body>
            `);
        }
        
        const mimeType = getMimeType(filename);
        
        // Set headers for proper download on all platforms (iPhone, Android, Windows)
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'no-cache');
        
        // Send the file (cross-platform path resolution)
        res.sendFile(path.resolve(filePath));
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Error downloading file');
    }
});

app.get('/', async function (req, res) { // async
    const localIp = getLocalIp();
    const url = `http://${localIp}:${PORT}`;
    const qrCodeImage = await QRCode.toDataURL(url);

    res.render('index', {
        title: "Local Clipboard",
        text: sharedText,
        files: sharedFile,
        qrCode: qrCodeImage, // Pass QR to view
        localUrl: url
    });
});



app.listen(PORT, () => {
    const localIp = getLocalIp();
    const url = `http://localhost:${PORT}`;
    console.log(`Listening on port ${PORT}`);
    console.log(`Local URL: ${url}`);
    console.log(`Network URL: http://${localIp}:${PORT}`);
    
    // Open browser automatically (cross-platform)
    const open = require('open');
    open(url).catch(err => {
        console.log('Could not open browser automatically. Please visit:', url);
    });
});
