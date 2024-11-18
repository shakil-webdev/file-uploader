const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { auth } = require('./middleware/auth');
const { fileUploadHelpers } = require('./helpers/fileUploadHelper');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Serve static files from 'public/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// app.use('/uploads', express.static('public/uploads'));

app.post('/upload', auth, fileUploadHelpers.upload.single('image'), (req, res) => {
  try {
    // Ensure the file exists
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: 'No file uploaded.'
      });
    }

    // Parse the JSON `data` field manually
    if (req.body.data) {
      try {
        JSON.parse(req.body.data);
      } catch (err) {
        return res.status(400).json({
          status: 400,
          success: false,
          error: 'Invalid JSON in `data` field.'
        });
      }
    }

    // Construct response
    const folder = `uploads/${req.body.folder}` || 'uploads';
    const imagePath = `/${folder}/${req.file.filename}`;
    const imageUrl = `${req.protocol}://${req.get('host')}${imagePath}`;

    res.status(201).json({
      status: 201,
      success: true,
      message: 'File uploaded successfully!',
      imageUrl,
      imagePath
    });
  } catch (error) {
    // console.error('Error during upload:', error);
    res.status(500).json({
      status: 500,
      success: false,
      error: 'An error occurred during file upload.',
      details: error.message
    });
  }
});

app.delete('/delete-file', auth, (req, res) => {
  const path = req.body.path;
  // console.log("Body: ", req.body)
  try {
    // console.log(fs.existsSync(`public/${path}`))
    if (fs.existsSync(`public/${path}`)) {
      fs.unlinkSync(`public/${path}`);
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid path'
      });
    }
    // fs.unlinkSync(`public/${path}`);

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Successfully deleted',
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Failed to delete'
    });
  }
});

app.get('/', (_req, res) => {
  res.send("Don't hit me!")
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//handle not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});


// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       const folder = `uploads/${req.body.folder}` || 'uploads'; // Get the folder from the request body
//       const fullPath = path.join(__dirname, 'public', folder);

//       // Create folder if it doesn't exist
//       if (!fs.existsSync(fullPath)) {
//           fs.mkdirSync(fullPath, { recursive: true });
//       }

//       cb(null, fullPath);
//   },
//   filename: (req, file, cb) => {
//       cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Timestamped filename
//   },
// });

// const upload = multer({ storage });