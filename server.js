// Simple file upload + static serving
const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Allowed MIME types (images, audio, video)
const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
  'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/mp4'
];

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || (500 * 1024 * 1024)); // 500MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = mime.extension(file.mimetype) || path.extname(file.originalname) || '';
    const filename = `${uuidv4()}${ext ? '.' + ext : ''}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Type de fichier non autorisé'), false);
};

const upload = multer({ storage, limits: { fileSize: maxFileSize }, fileFilter });

const fs = require('fs');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve uploaded files at /files/<filename>
app.use('/files', express.static(UPLOAD_DIR, {
  // Optionally set headers, cache-control, etc.
}));

// Single file upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });
  const publicUrl = `${BASE_URL}/files/${encodeURIComponent(req.file.filename)}`;
  res.json({
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    url: publicUrl
  });
});

// Multi file upload endpoint
app.post('/upload-multiple', upload.array('files', 20), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'Aucun fichier reçu' });
  const files = req.files.map(f => ({
    filename: f.filename,
    originalname: f.originalname,
    mimetype: f.mimetype,
    size: f.size,
    url: `${BASE_URL}/files/${encodeURIComponent(f.filename)}`
  }));
  res.json({ files });
});

// Simple health check
app.get('/ping', (req, res) => res.send('ok'));

// Error handler (must be after all routes)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux' });
    }
    return res.status(400).json({ error: err.message || 'Erreur d\'upload' });
  }
  
  // Other errors
  res.status(400).json({ error: err.message || 'Erreur' });
});

app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}`);
});