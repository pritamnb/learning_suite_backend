import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../ada_project/src')); // Store files in the ada_project/src folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Save with original filename
    }
});

export const uploadMiddleware = multer({ storage }).fields([
    { name: 'specFile', maxCount: 1 },
    { name: 'bodyFile', maxCount: 1 }
]);
