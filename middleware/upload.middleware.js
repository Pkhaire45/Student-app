const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Default to assignments, can be made dynamic if needed
        const uploadPath = path.join("uploads", "assignments");
        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-random.ext
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter (optional, can be expanded)
const fileFilter = (req, file, cb) => {
    // Accept all files for now, or filter by mimetype
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter,
});

module.exports = upload;
