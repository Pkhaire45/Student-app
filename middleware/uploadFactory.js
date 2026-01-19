const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploader = (subfolder) => {
    const uploadPath = path.join(__dirname, `../uploads/${subfolder}`);

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        }
    });

    return multer({ storage: storage });
};

module.exports = createUploader;
