const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = `uploads/${req.body.folder}` || 'uploads'; // Get the folder from the request body
        // const fullPath = path.join(__dirname, 'public', folder);
        const fullPath = path.join('public', folder);

        // Create folder if it doesn't exist
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Timestamped filename
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 300 * 1024 * 1024 } // Set limit to 300MB (500 * 1024 * 1024 bytes)
 });

exports.fileUploadHelpers = {
    upload,
}