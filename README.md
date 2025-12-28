# Local Clipboard

A simple local network clipboard application that allows you to share text and files between your computer and mobile devices. Similar to Apple's Universal Clipboard, but works across all platforms.

## Features

- 📝 Share text between devices on your local network
- 📁 Upload and download files
- 📱 Works on iPhone, Android, Windows, and Mac
- 🔗 QR code for easy connection
- 🚀 No password required - simple and fast

## For End Users (Non-Technical)

### How to Install and Use

#### Option 1: Download Pre-built Executable (Easiest)

1. **Download the executable** for your platform from the [Releases](https://github.com/yourusername/local-clipboard/releases) page:
   - **Mac (Apple Silicon/M1/M2)**: Download `local-clipboard-arm64`
   - **Mac (Intel)**: Download `local-clipboard-x64`
   - **Windows**: Download `local-clipboard.exe`

2. **Run the application**:
   - **Mac**: 
     - Right-click the file → Open (first time only, to bypass security warning)
     - Or: `chmod +x local-clipboard-arm64` then double-click
   - **Windows**: Double-click the `.exe` file

3. **Browser opens automatically**: The app will open in your default browser showing a QR code

4. **Connect your phone**: 
   - Scan the QR code with your phone's camera
   - Make sure your phone and computer are on the same Wi-Fi network

5. **Start sharing**: 
   - Type text and click "Update Text" to share it
   - Upload files to share them
   - Download files on your phone

#### Option 2: Build from Source (For Developers)

See the "For Developers" section below.

### Requirements

- Your computer and phone must be on the same Wi-Fi network
- No additional software installation needed - the executable is self-contained
- **Mac users**: You may need to allow the app in System Settings → Privacy & Security (first run only)

## For Developers

### Building from Source

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Specterr07/local-clipboard.git
   cd local-clipboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build executables**:
   ```bash
   # Build for Mac (Intel and Apple Silicon)
   npm run build:mac
   
   # Build for Windows
   npm run build:win
   
   # Build for both platforms
   npm run build:all
   ```

4. **Find your executables**: Built executables will be in the `dist/` folder

### Distributing to Friends

**For non-technical users**, share the executable files from the `dist/` folder:

1. **Create a GitHub Release** (Recommended):
   - Go to https://github.com/Specterr07/local-clipboard
   - Click "Releases" → "Create a new release"
   - Upload the executable files from `dist/` folder:
     - `local-clipboard-arm64` (Mac Apple Silicon)
     - `local-clipboard-x64` (Mac Intel)
     - `local-clipboard.exe` (Windows)
   - Tag the release (e.g., `v1.0.0`)
   - Add release notes
   - Friends can download from the Releases page

2. **Or share directly**:
   - Upload executables to Google Drive, Dropbox, or similar
   - Share the download link
   - Friends download and run - no installation needed!

### Development

To run the app in development mode:

```bash
npm start
```

The app will run on `http://localhost:3000`

### Project Structure

```
local-clipboard/
├── server.js          # Main server file
├── views/
│   └── index.ejs      # Web interface template
├── uploads/           # Uploaded files directory (created automatically)
├── package.json       # Dependencies and build configuration
└── README.md          # This file
```

### Technical Details

- **Framework**: Express.js (Node.js)
- **Template Engine**: EJS
- **File Upload**: Multer
- **QR Code**: qrcode library
- **Packaging**: pkg (bundles Node.js runtime)

### Building Executables

The project uses [pkg](https://github.com/vercel/pkg) to create standalone executables. The build process:

- Bundles Node.js runtime (~50-100MB per executable)
- Includes all dependencies
- Creates platform-specific executables
- No Node.js installation required for end users

### Customization

- **Port**: Change `PORT` constant in `server.js` (default: 3000)
- **File size limit**: Modify `fileSize` limit in multer configuration (default: 100MB)

## Troubleshooting

### App won't start
- Make sure no other application is using port 3000
- Check your firewall settings

### Can't connect from phone
- Ensure both devices are on the same Wi-Fi network
- Check that your firewall allows connections on port 3000
- Try accessing the IP address directly instead of scanning QR code

### File upload fails
- Check file size (limit is 100MB)
- Ensure you have write permissions in the uploads directory

## License

ISC

## Author

Vivek Patel

